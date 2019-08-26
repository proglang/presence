<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\AuthenticatedUserRepository;
use App\Repositories\ExamRepository;
use App\Http\Validators\ValidatesExamRequests;
use Illuminate\Http\Request;
use App\Http\Resources\ExamResource;
use App\Repositories\AuthExamUserRightsRepository;
use App\Exceptions\UserAccessException;

class ExamController extends Controller
{
    use ValidatesExamRequests;

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
    public function create(Request $request)
    {
        $this->validateExam($request);

        $data = $request->only('name', 'date');
        $exam = ExamRepository::create($this->user, $data['name'], $data['date']);
        return self::createResponse(201)->addResource($exam->getExamResource());
    }

    /**
     * List all existing exams for the current user
     *
     * @return App\Http\Response\Response
     */
    public function list()
    {
        $res = self::createResponse(200);
        $exams = $this->user->getExams();
        foreach ($exams as $exam) {
            $res->addResourceArray($exam->getExamResource());
        }
        if (count($exams)==0) {
            $res->addJson((new ExamResource(null))::$wrap.'s', []);
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
    public function update(Request $request, $exam_id)
    {
        $this->validateExam($request);
        
        $eu = new AuthExamUserRightsRepository($exam_id);
        if (!$eu->canUpdateExam()) {
            throw new UserAccessException('update', 'Cannot update exam', 403, $exam_id);
        }
        $exam = $eu->getExam();
        $exam->setName($request['name'], false);
        $exam->setDate($request['date']);
        return self::createResponse(200)->addResource($exam->getExamResource());
    }

    /**
     * Get the data of the selected exam
     * 
     * @param int $exam_id
     * 
     * @return App\Http\Response\Response 
     */
    public function get($exam_id)
    {
        $eu = new AuthExamUserRightsRepository($exam_id);
        if ($eu->canViewExam()) {
            return self::createResponse(200)->addResource($eu->getExam()->getExamResource());
        }
        throw new UserAccessException('view', 'Cannot show exam', 403, $exam_id);
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response 
     */
    public function delete($exam_id)
    {
        $eu = new AuthExamUserRightsRepository($exam_id);
        if ($eu->canDeleteExam()) {
            $eu->getExam()->delete();
            return self::createResponse(204);
        }
        throw new UserAccessException('delete', 'Cannot delete exam', 403, $exam_id);
    }
}
