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
use App\Repositories\ExamUserRepository;
use App\Http\Validators\ValidatesExamUserRequests;
use App\Repositories\ExamUserRightsRepository;

class ExamUserController extends Controller
{
    use ValidatesExamUserRequests;

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
        if (!$eur->canAddExamUser()) {
            throw new UserAccessException('adduser', 'Cannot add user to exam', 403, $exam_id);
        }
        $this->validateExamUser($request);
        $data = $request->only('id', 'note', 'level', 'rights');
        $eu = ExamUserRepository::addUser($exam_id, $data['id']);
        $eu->setNote($data['note'] ?? '');
        $rights = $eu->getRights();
        $rights->setLevel($data['level']  ?? null);
        $rights->setRights($data['rights']  ?? []);
        $eu->refresh();
        return self::createResponse(201)->addResource($eu->toResource());
    }

    /**
     * List all existing exams for the current user
     *
     * @return App\Http\Response\Response
     */
    public function list(int $exam_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamUser()) {
            throw new UserAccessException('viewuser', 'Cannot view users of this exam', 403, $exam_id);
        }
        $exam = ExamRepository::fromID($exam_id);
        $res = self::createResponse(200);
        $users = $exam->getUser();
        foreach ($users as $user) {
            $res->addResourceArray($user->toResource());
        }
        if (count($users)==0) {
            $res->addJson((new ExamUserResource(null))::$wrap.'s', []);
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
    public function update(Request $request, int $exam_id, int $user_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canUpdateExamUser()) {
            throw new UserAccessException('update.user', 'Cannot update users of this exam', 403, $exam_id);
        }
        if ($eur->getUser()->getID()==$user_id) {
            throw new UserAccessException('update.user.self', 'You cannot update yourself!', 403, $exam_id);
        }
        if ($eur->getExam()->getCreator()==$user_id) {
            throw new UserAccessException('update.user.creator', 'Exam Creator cannot be updated!', 403, $exam_id);
        }

        $this->validateExamUserUpdate($request);
        $data = $request->only('note', 'level', 'rights');

        $res = self::createResponse(200);
        $eu = ExamUserRepository::fromID($exam_id, $user_id);
        $eu->setNote($data['note'] ?? '');
        $rights = $eu->getRights();
        $rights->setLevel($data['level']  ?? null, $eur);
        $rights->setRights($data['rights']  ?? [], $eur);
        $eu->refresh();
        $res->addResource($eu->toResource());
        return $res;
    }

    /**
     * Get the data of the selected exam
     * 
     * @param int $exam_id
     * 
     * @return App\Http\Response\Response 
     */
    public function get(int $exam_id, int $user_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canViewExamUser()) {
            throw new UserAccessException('viewuser', 'Cannot view users of this exam', 403, $exam_id);
        }
        $res = self::createResponse(200);
        $eu = ExamUserRepository::fromID($exam_id, $user_id);
        $res->addResource($eu->toResource());
        return $res;
    }

    /**
     * Get the data of the selected exam
     *
     * @param int $exam_id
     *
     * @return App\Http\Response\Response
     */
    public function delete(int $exam_id, int $user_id)
    {
        $eur = new AuthExamUserRightsRepository($exam_id);
        if (!$eur->canDeleteExamUser()) {
            throw new UserAccessException('deluser', 'Cannot delete users of this exam', 403, $exam_id);
        }
        if ($eur->getUser()->getID()==$user_id) {
            throw new UserAccessException('deluser.self', 'You cannot delete yourself!', 403, $exam_id);
        }
        if ($eur->getExam()->getCreator()==$user_id) {
            throw new UserAccessException('deluser.creator', 'Exam Creator cannot be deleted!', 403, $exam_id);
        }
        $eur2 = ExamUserRightsRepository::fromID($exam_id, $user_id);
        if ($eur2->canDeleteExam() && $eur->getExam()->getCreator()!=$eur->getUser()->getID()) {
            throw new UserAccessException('deluser.samelv', 'User cannot be deleted: Only creator can delete this user!', 403, $exam_id);
        }
        $eu = ExamUserRepository::fromID($exam_id, $user_id);
        $eu->delete();
        return self::createResponse(204);
    }
}
