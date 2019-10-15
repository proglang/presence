<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Models\ExamRoom;
use App\Exceptions\NotFoundException;
use App\Http\Resources\ExamRoomResource;

class ExamRoomRepository extends BaseDatabaseRepository
{
    use RepositoryTrait;
    public function isValid(): bool {
        return $this->er != null;
    }
    public function get() {
        $this->assertValid();
        return $this->er;
    }
    protected $er = null;
    public function __construct(ExamRoom $er)
    {
        $this->er = $er;
    }
    public static function fromID(int $room_id):ExamRoomRepository {
        $ret = ExamRoom::find($room_id);
        if ($ret==null) {
            throw new NotFoundException('examroom', 'Exam Room not found!', 404, $room_id);
        }
        return new ExamRoomRepository($ret);
    }
    public static function add($exam):ExamRoomRepository {
        $exam = self::toExamRepository($exam);
        $er = ExamRoom::create(["exam_id"=>$exam->getID()]);
        return new ExamRoomRepository($er);
    }
    public function delete() {
        $this->assertValid();
        $this->er->delete();
        return true;
    }
    public function getNote():string
    {
        $this->assertValid();
        return $this->er->note;
    }
    public function setNote(?string $note, bool $save = true): ExamRoomRepository
    {
        if ($note==null) return $this;
        $this->assertValid();
        $this->er->note = $note;
        if ($save) self::save($this->er);
        return $this;
    }

    public function getName():string
    {
        $this->assertValid();
        return $this->er->name;
    }
    public function setName(?string $name, bool $save = true): ExamRoomRepository
    {
        if ($name==null) return $this;
        $this->assertValid();
        $this->er->name = $name;
        if ($save) self::save($this->er);
        return $this;
    }

    public function getSize():int
    {
        $this->assertValid();
        return $this->er->size;
    }
    public function setSize(?int $size, bool $save = true): ExamRoomRepository
    {
        if ($size==null) return $this;
        $this->assertValid();
        $this->er->size = $size;
        if ($save) self::save($this->er);
        return $this;
    }

    public function toResource():ExamRoomResource {
        return new ExamRoomResource($this->er);
    }
}