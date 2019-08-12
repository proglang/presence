<?php

namespace App\Repositories;

use App\Models\ExamUser;
use ErrorException;
use App\Exceptions\NotFoundException;
use App\Exceptions\UserAccessException;

class ExamUserRightsRepository extends BaseDatabaseRepository
{

    const RIGHTS = [
        'view' => 0,
        'delete' => 1,
        'update'=>2,
        'exam_viewuser'=>3,
        'exam_adduser'=>4,
        'exam_deleteuser'=>5,
        'exam_updateuser'=>6
    ];
    const Level = [
        'admin'=>[],
        'updater'=>[],
        'viewer'=>[],
        'none'=>[],
    ];
    protected $user = null;
    protected $exam = null;
    public function __construct(ExamRepository $exam, UserRepository $user)
    {
        $this->user = $user;
        $this->exam = $exam;
    }
    public function getExam() {
        return $this->exam;
    }
    public function getUser() {
        return $this->user;
    }
    public static function create($exam, $user) {
        if (!($user instanceof UserRepository)) {
            $user = UserRepository::fromID($user);
        }
        if (!($exam instanceof ExamRepository)) {
            $exam = ExamRepository::fromID($exam);
        }
        ExamUser::create(['exam_id'=>$exam->getID(), 'user_id'=>$user->getID(), 'rights'=>0]);
        return new ExamUserRightsRepository($exam, $user);
    }
    public static function fromID($exam, $user) {
        if (!($user instanceof UserRepository)) {
            $user = UserRepository::fromID($user);
        }
        if (!($exam instanceof ExamRepository)) {
            $exam = ExamRepository::fromID($exam);
        }
        return new ExamUserRightsRepository($exam, $user);
    }
    public function init($exam, $user)
    {
        $this->setUser($user);
        $this->setExam($exam);
    }
    public function setUser($user)
    {
        if ($user instanceof UserRepository) {
            $this->user = $user;
        } else {
            $this->user->setID($user);
        }
    }
    public function setExam($exam)
    {
        if ($exam instanceof ExamRepository) {
            $this->exam = $exam;
        } else {
            $this->exam->setID($exam);
        }
    }
    public function isValid(): bool
    {
        return $this->user->isValid() && $this->exam->isValid();
    }

    protected function getRight(string $name)
    {
        if ($this->exam->isCreator($this->user->getID())) {
            return true;
        }
        $res = ExamUser::where([['user_id', $this->user->getID()], ['exam_id', $this->exam->getID()]]);
        try {
            $res = $res->first()->rights;
        } catch (ErrorException $e) {
            // same error as in Exam
            throw new NotFoundException("exam", "Exam not found", 404, $this->exam->getID());
        }
        // print_r("\n$name: $res ".(1 << self::RIGHTS[$name]));
        return ($res & (1 << self::RIGHTS[$name]))!=0;
    }
    protected function setRight(string $name, bool $new, ?ExamUserRightsRepository $user = null): bool
    {
        if ($user!=null && !$user->getRight($name)) {
            throw new UserAccessException("set.$name", "Cannot change right of user!", 403);
        }
        $current = $this->getRight($name);
        if ($current==$new) {
            return true;
        }
        $val =  (1 << self::RIGHTS[$name]);
        if (!$new) $val = -$val;

        $db =  ExamUser::where([['user_id', $this->user->getID()], ['exam_id', $this->exam->getID()]])->first();

        $db->rights = $db->rights+$val;
        self::save($db);
        return true;
    }
    public function setRights(array $rights, ?ExamUserRightsRepository $user = null) {
        $db =  ExamUser::where([['user_id', $this->user->getID()], ['exam_id', $this->exam->getID()]])->first();
        foreach ($rights as $name => $new) {
            try {
               $this->setRight($name, $new, $user);
            } catch(UserAccessException $e) {
                self::save($db); // rollback changes
                throw $e;
            }
        }
        return true;
    }
    public function setLevel(?string $name, ?ExamUserRightsRepository $user = null) {
        if ($name==null) return true;
        if (!isset(self::Level[$name])) {
            throw new NotFoundException("right", "Right not found", 404, $name);
        }
        $rights = self::Level[$name];
        foreach (array_keys(self::RIGHTS) as $key) {
            $rights[$key] = ($rights[$key] ?? false)==true;
        }
        return $this->setRights($rights, $user);
    }
    public function canDeleteExam(): bool
    {
        return $this->getRight('delete');
    }
    public function setCanDeleteExam(bool $can) {
        return $this->setRight('delete', $can);
    }
    public function canViewExam(): bool
    {
        return $this->getRight('view');
    }
    public function setCanViewExam(bool $can) {
        return $this->setRight('view', $can);
    }
    public function canUpdateExam(): bool
    {
        return $this->getRight('update');
    }
    public function setCanUpdateExam(bool $can) {
        return $this->setRight('update', $can);
    }

    public function canViewExamUser(): bool
    {
        return $this->getRight('exam_viewuser');
    }
    public function setCanViewExamUser(bool $can) {
        return $this->setRight('exam_viewuser', $can);
    }


    public function canAddExamUser(): bool
    {
        return $this->getRight('exam_adduser');
    }
    public function setCanAddExamUser(bool $can) {
        return $this->setRight('exam_adduser', $can);
    }

    public function canDeleteExamUser(): bool
    {
        return $this->getRight('exam_deleteuser');
    }
    public function setCanDeleteExamUser(bool $can) {
        return $this->setRight('exam_deleteuser', $can);
    }
    
    public function canUpdateExamUser(): bool
    {
        return $this->getRight('exam_updateuser');
    }
    public function setCanUpdateExamUser(bool $can) {
        return $this->setRight('exam_updateuser', $can);
    }

    public function list() {
        $res = [];
        foreach (array_keys(self::RIGHTS) as $right) {
            $res[$right] = $this->getRight($right);
        }
        return $res;
    }
}

class AuthExamUserRightsRepository extends ExamUserRightsRepository {
    public function __construct($exam)
    {
        if (!($exam instanceof ExamRepository)) {
            $exam = ExamRepository::fromID($exam);
        }
        $this->exam = $exam;
        $this->user = new AuthenticatedUserRepository();
    }
}