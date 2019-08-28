<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Models\Exam;
use Illuminate\Database\QueryException;
use App\Http\Resources\ExamResource;
use App\Exceptions\CreateException;
use App\Exceptions\NotFoundException;
use Carbon\Carbon;

class ExamRepository extends BaseDatabaseRepository
{
    protected $exam = null;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
    }
    public static function fromID(int $id)
    {
        $exam = Exam::find($id);
        if ($exam == null) throw new NotFoundException("exam", "Exam not Found", 404, $id);
        return new ExamRepository($exam);
    }
    public static function create(UserRepository $user, $name, $date): ExamRepository
    {
        try {
            $exam = Exam::create([
                "creator_id" => $user->getID(),
                "name" => $name,
                "date" => Carbon::createFromTimestamp($date),
                "locked" => false
            ]);
        } catch (QueryException $e) {
            throw new CreateException("exam", "Cannot Create Exam", 422, $e->getSql());
        }
        // creator automatically has all rights so no point in using access checking class
        return new ExamRepository($exam);
    }
    public function getUser()
    {
        $res = [];
        foreach ($this->exam->user as $value) {
            $res[] = ExamUserRepository::fromID($this->exam->id, $value->id);
        }
        return $res;
    }
    public function getRooms()
    {
        $res = [];
        foreach ($this->exam->rooms as $value) {
            $res[] = ExamRoomRepository::fromID($value->id);
        }
        return $res;
    }
    public function getStudents()
    {
        $res = [];
        foreach ($this->exam->students as $value) {
            $res[] = ExamStudentRepository::fromID($value->id);
        }
        return $res;
    }
    public function getNotes(int $type = null)
    {
        $res = [];
        if ($type == 2) {
            foreach ($this->exam->allNotes as $value) {
                $res[] = ExamLogRepository::fromID($value->id);
            }
            return $res;
        }
        if ($type == 1) {
            foreach ($this->exam->deletedNotes as $value) {
                $res[] = ExamLogRepository::fromID($value->id);
            }
            return $res;
        }
        foreach ($this->exam->notes as $value) {
            $res[] = ExamLogRepository::fromID($value->id);
        }
        return $res;
    }
    public function get(): Exam
    {
        $this->assertValid();
        return $this->exam;
    }
    public function isValid(): bool
    {
        return $this->exam != null;
    }
    public function getID(): int
    {
        $this->assertValid();
        return $this->exam->id;
    }
    public function getExamResource(): ExamResource
    {
        return new ExamResource($this->exam);
    }
    public function getCreator()
    {
        return $this->exam->creator_id;
    }
    public function isCreator(int $id)
    {
        return $this->getCreator() == $id;
    }
    public function delete()
    {
        return $this->exam->delete();
    }

    public function getName(): string
    {
        $this->assertValid();
        return $this->exam->name;
    }
    public function setName(string $name, bool $save = true): ExamRepository
    {
        $this->assertValid();
        $this->exam->name = $name;
        if ($save) self::save($this->exam);
        return $this;
    }
    public function getDate(): string
    {
        $this->assertValid();
        return $this->exam->date;
    }
    public function setDate(int $date, bool $save = true): ExamRepository
    {
        $this->assertValid();
        $this->exam->date = Carbon::createFromTimestamp($date);
        if ($save) self::save($this->exam);
        return $this;
    }
}
