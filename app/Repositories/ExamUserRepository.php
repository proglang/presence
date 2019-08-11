<?php

namespace App\Repositories;

use App\Models\ExamUser;
use ErrorException;
use App\Exceptions\NotFoundException;

class ExamUserRightsRepository extends BaseDatabaseRepository
{

    const RIGHTS = [
        'view' => 0,
        'delete' => 1,
        'update'=>2,
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
    protected function setRights(string $name, bool $new): bool
    {
        $current = $this->getRight($name);
        if ($current==$new) {
            return true;
        }
        $val =  (1 << self::RIGHTS[$name]);
        if (!$new)   $val = -$val;
        
        $db =  ExamUser::where([['user_id', $this->user->getID()], ['exam_id', $this->exam->getID()]])->first();
        
        $db->rights = $db->rights+$val;
        self::save($db);
        return true;
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