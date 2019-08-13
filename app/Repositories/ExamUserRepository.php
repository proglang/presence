<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Models\ExamUser;
use App\Models\User;
use App\Exceptions\NotFoundException;
use App\Http\Resources\ExamUserResource;

class ExamUserRepository extends BaseDatabaseRepository
{
    use RepositoryTrait;
    public function isValid(): bool {
        return $this->eu != null;
    }
    public function get() {
        $this->assertValid();
        return $this->eu;
    }
    protected $eu = null;
    public function __construct(ExamUser $eu)
    {
        $this->eu = $eu;
    }
    public static function fromID($exam, $user):ExamUserRepository {
        $user = self::toUserRepository($user);
        $exam = self::toExamRepository($exam);
        $ret = ExamUser::where([['exam_id', $exam->getID()], ['user_id', $user->getID()]])->first();
        if ($ret==null) {
            throw new NotFoundException('examuser', 'Exam User not found!', 404, ['exam'=>$exam->getID(), 'user'=>$user->getID()]);
        }
        return new ExamUserRepository($ret);
    }
    public static function addUser($exam, $user):ExamUserRepository {
        $user = self::toUserRepository($user);
        $exam = self::toExamRepository($exam);
        ExamUserRightsRepository::create($exam, $user);
        return self::fromID($exam, $user);
    }
    public function delete() {
        $this->assertValid();
        $this->eu->delete();
        return true;
    }
    public function getNote():string
    {
        $this->assertValid();
        return $this->eu->note ?? '';
    }
    public function setNote(string $note, bool $save = true): ExamUserRepository
    {
        $this->assertValid();
        $this->eu->note = $note;
        if ($save) self::save($this->eu);
        return $this;
    }
    public function toResource() {
        return new ExamUserResource($this->eu);
    }

    public function getRights():ExamUserRightsRepository {
        $this->assertValid();
        return ExamUserRightsRepository::fromID($this->eu->exam_id, $this->eu->user_id);
    }
    public function refresh() {
        $this->eu = self::fromID($this->eu->exam_id, $this->eu->user_id)->eu;
        return $this;
    }
}