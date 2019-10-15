<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\AuthenticatedUserRepository;
use App\Repositories\ExamRepository;
use Illuminate\Http\Request;
use App\Repositories\AuthExamUserRightsRepository;
use App\Exceptions\UserAccessException;
use App\Repositories\ExamRoomRepository;
use App\Http\Validators\ValidatesExamRoomRequests;
use App\Http\Resources\ExamRoomResource;

class ExamRoomController extends Controller
{
    use ValidatesExamRoomRequests;

    protected $user = null;
    public function __construct(AuthenticatedUserRepository $user)
    {
        $this->user = $user;
    }

    /**
     * Create a new Exam
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return App\Http\Response\Response
     */
    public function add(Request $request, int $exam_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canAddExamRoom()) {
            throw new UserAccessException('addroom', 'Cannot add room to exam', 403, $exam_id);
        }
        $this->validateExamRoom($request);
        $data = $request->only('name', 'note', 'size');
        $er = ExamRoomRepository::add($exam_id);
        $er->setNote($data['note'] ?? '');
        $er->setName($data['name'] ?? '');
        $er->setSize($data['size'] ?? 0);

        return self::createResponse(201)->addResource($er->toResource());
    }

    /**
     * List all existing exams for the current user
     *
     * @return App\Http\Response\Response
     */
    public function list(int $exam_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamRoom()) {
            throw new UserAccessException('viewroom', 'Cannot view rooms of this exam', 403, $exam_id);
        }
        $exam = ExamRepository::fromID($exam_id);
        $res = self::createResponse(200);
        $rooms = $exam->getRooms();
        foreach ($rooms as $room) {
            $res->addResourceArray($room->toResource());
        }
        if (count($rooms)==0) {
            $res->addJson((new ExamRoomResource(null))::$wrap.'s', []);
        }
        return $res;
    }

    /**
     * Update data of the selected exam
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function update(Request $request, int $exam_id, int $room_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canUpdateExamRoom()) {
            throw new UserAccessException('update.room', 'Cannot update users of this exam', 403, $exam_id);
        }

        $this->validateExamRoomUpdate($request);
        $data = $request->only('note', 'name', 'size');

        $res = self::createResponse(200);
        $er = ExamRoomRepository::fromID($room_id);
        $er->setNote($data['note'] ?? null);
        $er->setName($data['name'] ?? null);
        $er->setSize($data['size'] ?? null);
        $res->addResource($er->toResource());
        return $res;
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function get(int $exam_id, int $room_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamRoom()) {
            throw new UserAccessException('viewroom', 'Cannot view rooms of this exam', 403, $exam_id);
        }
        $res = self::createResponse(200);
        $er = ExamRoomRepository::fromID($room_id);
        $res->addResource($er->toResource());
        return $res;
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function delete(int $exam_id, int $room_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canDeleteExamRoom()) {
            throw new UserAccessException('delroom', 'Cannot delete users of this exam', 403, $exam_id);
        }
        $er = ExamRoomRepository::fromID($room_id);
        $er->delete();
        return self::createResponse(204);
    }
}
