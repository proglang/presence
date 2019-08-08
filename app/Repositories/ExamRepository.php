<?php

namespace APP\Repositories;

use App\Models\Exam;
use Illuminate\Database\QueryException;

class ExamRepository extends BaseDatabaseRepository implements IResponseRepository
{
    protected $exam = null;

    public function __construct(Exam $exam)
    {
        $this->exam = $exam;
    }
    public static function create(UserRepository $user, $name, $date) :ExamRepository {
        try {
        $exam = Exam::create([
            "creator_id"=>$user->getID(),
            "name"=>$name,
            "date"=>$date,
            "locked"=>false
        ]);
        }catch (QueryException $e) {
            throw new CreateException("exam","Cannot Create Exam", 422, $e->getSql());
        }
        // creator automatically has all rights so no point in using access checking class
        return new ExamRepository($exam);
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

}

class UserExamRepository extends ExamRepository {
    protected $user = null;
    public function __construct(Exam $exam)
    {
        parent::__construct($exam);
    }
    public function setUser(UserRepository $user) {
        $this->user = $user;
    }

    public function isValid(): bool
    {
        return parent::IsValid() && $this->user->isValid();
    }

}