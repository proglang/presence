<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\AuthenticatedUserRepository;
use Illuminate\Http\Request;
use App\Repositories\AuthExamUserRightsRepository;
use App\Exceptions\UserAccessException;
use App\Http\Validators\ValidatesExamLogRequests;
use App\Repositories\ExamLogRepository;
use App\Http\Resources\ExamLogResource;
use App\Repositories\ExamRepository;

class ExamLogController extends Controller
{
    use ValidatesExamLogRequests;

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
    public function add(Request $request, int $exam_id, int $student_id = null)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canAddExamLog()) {
            throw new UserAccessException('addlog', 'Cannot add logentry to exam', 403, $exam_id);
        }
        $this->validateLogEntry($request);
        $el = ExamLogRepository::add($eur->getUser(), $exam_id, $student_id, $request->text);
        return self::createResponse(201)->addResource($el->toResource());
    }

    /**
     * List all existing exams for the current user
     *
     * @return App\Http\Response\Response
     */
    public function list(Request $request, int $exam_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamLog()) {
            throw new UserAccessException('viewlog', 'Cannot view log of this exam', 403, $exam_id);
        }
        $exam = ExamRepository::fromID($exam_id);
        $res = self::createResponse(200);
        $notes = [];

        if ($request->view == 'all') {
            $notes = $exam->getNotes(2);
        } elseif ($request->view == 'deleted') {
            $notes = $exam->getNotes(1);
        } else {
            $notes = $exam->getNotes();
        }
        foreach ($notes as $note) {
            $res->addResourceArray($note->toResource());
        }
        if (count($notes) == 0) {
            $res->addJson((new ExamLogResource(null))::$wrap . 's', []);
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
    public function update(Request $request, int $exam_id, int $note_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canUpdateExamLog()) {
            throw new UserAccessException('update.log', 'Cannot update logentries of this exam', 403, $exam_id);
        }

        $this->validateLogEntry($request);

        $res = self::createResponse(200);
        $elr = ExamLogRepository::fromID($note_id);
        $elr->setText($eur->getUser(), $request->text);
        $res->addResource($elr->toResource());
        return $res;
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function get(int $exam_id, int $note_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamLog()) {
            throw new UserAccessException('viewlog', 'Cannot view log of this exam', 403, $exam_id);
        }
        $res = self::createResponse(200);
        $er = ExamLogRepository::fromID($note_id);
        $res->addResource($er->toResource(true));
        return $res;
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function delete(int $exam_id, int $note_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canDeleteExamLog()) {
            throw new UserAccessException('dellog', 'Cannot delete log of this exam', 403, $exam_id);
        }
        $er = ExamLogRepository::fromID($note_id);
        $er->delete();
        return self::createResponse(204);
    }
}
