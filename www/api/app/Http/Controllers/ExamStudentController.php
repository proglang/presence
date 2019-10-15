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
use App\Repositories\ExamStudentRepository;
use App\Http\Validators\ValidatesExamStudentRequests;
use App\Http\Resources\ExamStudentResource;

class ExamStudentController extends Controller
{
    use ValidatesExamStudentRequests;

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
        if (!$eur->canAddExamStudent()) {
            throw new UserAccessException('addstudent', 'Cannot add student to exam', 403, $exam_id);
        }
        $this->validateExamStudent($request, $exam_id);
        $data = $request->only('name', 'ident');
        $er = ExamStudentRepository::add($exam_id, $data['ident']);
        $er->setName($data['name'] ?? '');

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
        if (!$eur->canViewExamStudent()) {
            throw new UserAccessException('viewstudent', 'Cannot view students of this exam', 403, $exam_id);
        }
        $exam = ExamRepository::fromID($exam_id);
        $res = self::createResponse(200);
        $students = $exam->getStudents();
        foreach ($students as $student) {
            $res->addResourceArray($student->toResource());
        }
        if (count($students)==0) {
            $res->addJson((new ExamStudentResource(null))::$wrap.'s', []);
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
    public function update(Request $request, int $exam_id, int $student_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canUpdateExamStudent()) {
            throw new UserAccessException('update.student', 'Cannot update students of this exam', 403, $exam_id);
        }

        $this->validateExamStudentUpdate($request, $exam_id, $student_id);
        $data = $request->only('name', 'ident');

        $res = self::createResponse(200);
        $er = ExamStudentRepository::fromID($student_id);
        $er->setName($data['name'] ?? null);
        $er->setIdent($data['ident'] ?? null);
        $res->addResource($er->toResource());
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
    public function setPresence(Request $request, int $exam_id, int $student_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canUpdateExamStudentPresence()) {
            throw new UserAccessException('update.student.presence', 'Cannot update student presence of this exam', 403, $exam_id);
        }

        //$this->validateExamStudentUpdate($request);

        $res = self::createResponse(200);
        $er = ExamStudentRepository::fromID($student_id);
        $er->setPresent($eur->getUser(), $request->val==1);
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
    public function get(int $exam_id, int $student_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamStudent()) {
            throw new UserAccessException('viewstudent', 'Cannot view students of this exam', 403, $exam_id);
        }
        $res = self::createResponse(200);
        $er = ExamStudentRepository::fromID($student_id);
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
    public function delete(int $exam_id, int $student_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canDeleteExamStudent()) {
            throw new UserAccessException('delstudent', 'Cannot delete users of this exam', 403, $exam_id);
        }
        $er = ExamStudentRepository::fromID($student_id);
        $er->delete();
        return self::createResponse(204);
    }
}
