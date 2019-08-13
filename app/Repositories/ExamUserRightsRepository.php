<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


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
        
        'exam_viewuser'=>5,
        'exam_adduser'=>6,
        'exam_deleteuser'=>7,
        'exam_updateuser'=>8,
        
        'exam_viewroom'=>11,
        'exam_addroom'=>12,
        'exam_deleteroom'=>13,
        'exam_updateroom'=>14,

        'exam_viewstudent'=>17,
        'exam_addstudent'=>18,
        'exam_deletestudent'=>19,
        'exam_updatestudent'=>20,
        'exam_updatestudent_presence'=>21,

        'exam_viewlog'=>23,
        'exam_addlog'=>24,
        'exam_deletelog'=>25,
        'exam_updatelog'=>26,

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
            $this->user= UserRepository::fromID($user);
        }
    }
    public function setExam($exam)
    {
        if ($exam instanceof ExamRepository) {
            $this->exam = $exam;
        } else {
            $this->exam= ExamRepository::fromID($exam);
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
    //! Basic exam rights
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
    public function canDeleteExam(): bool
    {
        return $this->getRight('delete');
    }
    public function setCanDeleteExam(bool $can) {
        return $this->setRight('delete', $can);
    }

    //! Exam User Rights
    public function canViewExamUser(): bool
    {
        return $this->getRight('exam_viewuser');
    }
    public function setCanViewExamUser(bool $can) {
        return $this->setRight('exam_viewuser', $can);
    }
    public function canUpdateExamUser(): bool
    {
        return $this->getRight('exam_updateuser');
    }
    public function setCanUpdateExamUser(bool $can) {
        return $this->setRight('exam_updateuser', $can);
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

    //! Exam Room Rights
    public function canViewExamRoom(): bool
    {
        return $this->getRight('exam_viewroom');
    }
    public function setCanViewExamRoom(bool $can) {
        return $this->setRight('exam_viewroom', $can);
    }
    public function canUpdateExamRoom(): bool
    {
        return $this->getRight('exam_updateroom');
    }
    public function setCanUpdateExamRoom(bool $can) {
        return $this->setRight('exam_updateroom', $can);
    }
    public function canAddExamRoom(): bool
    {
        return $this->getRight('exam_addroom');
    }
    public function setCanAddExamRoom(bool $can) {
        return $this->setRight('exam_addroom', $can);
    }
    public function canDeleteExamRoom(): bool
    {
        return $this->getRight('exam_deleteroom');
    }
    public function setCanDeleteExamRoom(bool $can) {
        return $this->setRight('exam_deleteroom', $can);
    }

    //! Exam Student Rights
    public function canViewExamStudent(): bool
    {
        return $this->getRight('exam_viewstudent');
    }
    public function setCanViewExamStudent(bool $can) {
        return $this->setRight('exam_viewstudent', $can);
    }
    public function canUpdateExamStudent(): bool
    {
        return $this->getRight('exam_updatestudent');
    }
    public function setCanUpdateExamStudent(bool $can) {
        return $this->setRight('exam_updatestudent', $can);
    }
    public function canUpdateExamStudentPresence(): bool
    {
        return $this->getRight('exam_updatestudent_presence');
    }
    public function setCanUpdateExamStudentPresence(bool $can) {
        return $this->setRight('exam_updatestudent_presence', $can);
    }
    public function canAddExamStudent(): bool
    {
        return $this->getRight('exam_addstudent');
    }
    public function setCanAddExamStudent(bool $can) {
        return $this->setRight('exam_addstudent', $can);
    }
    public function canDeleteExamStudent(): bool
    {
        return $this->getRight('exam_deletestudent');
    }
    public function setCanDeleteExamStudent(bool $can) {
        return $this->setRight('exam_deletestudent', $can);
    }
    
    //! Exam Log Rights
    public function canViewExamLog(): bool
    {
        return $this->getRight('exam_viewlog');
    }
    public function setCanViewExamLog(bool $can) {
        return $this->setRight('exam_viewlog', $can);
    }
    public function canUpdateExamLog(): bool
    {
        return $this->getRight('exam_updatelog');
    }
    public function setCanUpdateExamLog(bool $can) {
        return $this->setRight('exam_updatelog', $can);
    }
    public function canAddExamLog(): bool
    {
        return $this->getRight('exam_addlog');
    }
    public function setCanAddExamLog(bool $can) {
        return $this->setRight('exam_addlog', $can);
    }
    public function canDeleteExamLog(): bool
    {
        return $this->getRight('exam_deletelog');
    }
    public function setCanDeleteExamLog(bool $can) {
        return $this->setRight('exam_deletelog', $can);
    }

    //! Helper
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