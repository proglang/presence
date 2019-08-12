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
                "date" => $date,
                "locked" => false
            ]);
        } catch (QueryException $e) {
            print_r($e->getMessage());
            throw new CreateException("exam", "Cannot Create Exam", 422, $e->getSql());
        }
        // creator automatically has all rights so no point in using access checking class
        return new ExamRepository($exam);
    }
    public function getUser() {
        $res = [];
        foreach ($this->exam->user as $value) {
            $res[] = ExamUserRepository::fromID($this->exam->id, $value->id);
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
    public function setID(int $id): bool
    {
        $this->exam = Exam::find($id);
        return $this->exam != null;
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
    public function setDate(string $date, bool $save = true): ExamRepository
    {
        $this->assertValid();
        $this->exam->date = $date;
        if ($save) self::save($this->exam);
        return $this;
    }
}
