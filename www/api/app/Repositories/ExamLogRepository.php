<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Exceptions\NotFoundException;
use App\Http\Resources\ExamLogHistoryResource;
use App\Models\ExamNoteRef;
use App\Models\Note;
use App\Http\Resources\ExamLogResource;

class ExamLogRepository extends BaseDatabaseRepository
{
    use RepositoryTrait;
    public function isValid(): bool {
        return $this->enr != null;
    }
    public function get() {
        $this->assertValid();
        return $this->enr;
    }
    protected $enr = null;
    public function __construct(ExamNoteRef $enr)
    {
        $this->enr = $enr;
    }

    public static function fromID(int $note_id):ExamLogRepository {
        $ret = ExamNoteRef::withTrashed()->find($note_id);
        if ($ret==null) {
            throw new NotFoundException('examnote', 'Exam note not found!', 404, $note_id);
        }
        return new ExamLogRepository($ret);
    }
    public static function add($user, $exam, ?int $student=null, string $text=""):ExamLogRepository {
        $exam = self::toExamRepository($exam);
        $user = self::toUserRepository($user);
        if ($student!=null) {
            //$student = self::toExamStudentRepository($student)->getID();
        }
        $enr = ExamNoteRef::create(["exam_id"=>$exam->getID(), 'student_id'=>$student]);
        Note::create(['note_id'=>$enr->id, 'user_id'=>$user->getID(), 'text'=>$text]);
        return new ExamLogRepository($enr);
    }
    public function delete() {
        $this->assertValid();
        $this->enr->delete();
        return true;
    }

    public function getText():string
    {
        $this->assertValid();
        return $this->enr->notes->text;
    }
    public function setText($user, ?string $text, bool $save = true): ExamLogRepository
    {
        if ($text==null) return $this;
        $this->assertValid();
        $user = self::toUserRepository($user);
        if ($this->enr->current()->text==$text) return $this;

        Note::create(['note_id'=>$this->enr->id, 'user_id'=>$user->getID(), 'text'=>$text]);
        $this->enr->touch();
        if ($save) self::save($this->enr);
        return $this;
    }

    public function toResource(bool $history=false):ExamLogResource {
        if ($history) return new ExamLogHistoryResource($this->enr);
        return new ExamLogResource($this->enr);
    }
}