<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Models\ExamStudent;
use App\Exceptions\NotFoundException;
use App\Http\Resources\ExamStudentResource;
use App\Models\StudentPresence;

class ExamStudentRepository extends BaseDatabaseRepository
{
    use RepositoryTrait;
    public function isValid(): bool {
        return $this->er != null;
    }
    public function get() {
        $this->assertValid();
        return $this->er;
    }
    protected $es = null;
    public function __construct(ExamStudent $es)
    {
        $this->er = $es;
    }
    public static function fromID(int $student_id):ExamStudentRepository {
        $ret = ExamStudent::find($student_id);
        if ($ret==null) {
            throw new NotFoundException('examstudent', 'Exam Student not found!', 404, $student_id);
        }
        return new ExamStudentRepository($ret);
    }
    public static function add($exam, $ident):ExamStudentRepository {
        $exam = self::toExamRepository($exam);
        $es = ExamStudent::create(["exam_id"=>$exam->getID(), 'ident'=>$ident]);
        return new ExamStudentRepository($es);
    }
    public function delete() {
        $this->assertValid();
        $this->er->delete();
        return true;
    }

    public function getName():string
    {
        $this->assertValid();
        return $this->er->name;
    }
    public function setName(?string $name, bool $save = true): ExamStudentRepository
    {
        if ($name==null) return $this;
        $this->assertValid();
        $this->er->name = $name;
        if ($save) self::save($this->er);
        return $this;
    }

    public function getIdent():string
    {
        $this->assertValid();
        return $this->er->ident;
    }
    public function setIdent($ident, bool $save = true): ExamStudentRepository
    {
        if ($ident==null) return $this;
        $this->assertValid();
        $this->er->ident = $ident;
        if ($save) self::save($this->er);
        return $this;
    }
    public function isPresent() {
        $s = StudentPresence::where('student_id', $this->er->id)->latest()->first();
        if ($s==null) return false;
        return $s->present;
    }
    public function setPresent($user, bool $val) {
        $user = self::toUserRepository($user);
        StudentPresence::create(['student_id'=>$this->er->id, 'present'=>$val, $user->getID(), 'user_id'=>$user->getID()]);
        return $this;
    }

    public function toResource():ExamStudentResource {
        return new ExamStudentResource($this->er);
    }
}