<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace tests\api;

use \App\Models\User;
use App\Models\Exam;
use App\Repositories\ExamUserRepository;
use App\Models\ExamStudent;
use App\Models\StudentPresence;

class ExamStudentRouteTest extends TestCase
{
    //! exam/*/student
    static protected function _getURL(int $exam_id, ?int $id = null, bool $add=false)
    {
        $url =  "/exam/$exam_id/student";
        if ($id != null) {
            $url = "$url/$id";
        }
        if ($add) {
            $url = "$url/presence";
        }
        return $url;
    }
    static protected function _getResult(ExamStudent $student, ?int $id = null, ?bool $present = null,?string $name=null)
    {
        // $student = $student->fresh();
        $student->refresh();
        $present = $student->presence->first();
        $present = $present == null ? false : $present->present;
        $ret = [
            'id' => $id == null ? $student->id : $id,
            'name' => $student->name,
            'ident' => $student->ident,
            'present' => $present,
            'user'=>$name
        ];
        return $ret;
    }
    public function test__GET()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudents" => []
            ]
        );
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.viewstudent","msg"=>"Cannot view students of this exam"]
            ]
        );


        $students = factory(ExamStudent::class, 2)->create(['exam_id' => $exam->id]);

        $result = [];
        foreach ($students as  $student) {
            $result[] = self::_getResult($student);
        }
        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudents" => $result
            ]
        );

        $exam_user->getRights()->setCanViewExamStudent(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudents" => $result
            ]
        );
    }
    /**
     * A basic test example.
     *
     * @return void
     */
    public function test__POST()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $student = factory(ExamStudent::class)->make();

        $res = $this->actingAs($admin)->json('POST', self::_getURL($exam->id), self::_getResult($student));
        $er = ExamStudent::latest('id')->first();
        $this->assertEquals(201, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($er)
            ]
        );

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), self::_getResult($student));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.addstudent","msg"=>"Cannot add student to exam"]
            ]
        );

        $exam_user->getRights()->setCanAddExamStudent(true);

        $student = factory(ExamStudent::class)->make();

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), self::_getResult($student));
        $this->assertEquals(201, $this->response->status());
        $er = ExamStudent::latest('id')->where('exam_id', $exam->id)->first();
        $res->seeJson(
            [
                "examstudent" => self::_getResult($er)
            ]
        );
    }

    public function test_ID_GET()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);
        $exam_id = $exam->id;

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam_id]);

        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($student)
            ]
        );

        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.viewstudent","msg"=>"Cannot view students of this exam"]
            ]
        );

        $exam_user->getRights()->setCanViewExamStudent(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($student)
            ]
        );

        StudentPresence::create(['student_id' => $student->id, 'present' => true, 'user_id'=>$user->id]);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($student, null, true, $user->name)
            ]
        );

        StudentPresence::create(['student_id' => $student->id, 'present' => false, 'user_id'=>$user->id]);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($student, null, false, $user->name)
            ]
        );
    }
    public function test_ID_PUT()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $new_student = factory(ExamStudent::class)->make();

        $res = $this->actingAs($admin)->json('PUT', self::_getURL($exam->id, $student->id), self::_getResult($new_student, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($new_student, $student->id)
            ]
        );

        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.update.student","msg"=>"Cannot update students of this exam"]
            ]
        );

        $new_student = factory(ExamStudent::class)->make();
        $exam_user->getRights()->setCanUpdateExamStudent(true);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id), self::_getResult($new_student, $student->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examstudent" => self::_getResult($new_student, $student->id)
            ]
        );
    }
    public function test_ID_present_PUT()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);

        $res = $this->actingAs($admin)->json('PUT', self::_getURL($exam->id, $student->id, true), ['val'=>1]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
           [ "examstudent" => self::_getResult($student, null, true, $admin->name)]
        );

        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id, true));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id, true));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.update.student.presence","msg"=>"Cannot update student presence of this exam"]
            ]
        );

        $exam_user->getRights()->setCanUpdateExamStudentPresence(true);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id, true), ['val'=>0]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [ "examstudent" => self::_getResult($student, null, false, $user->name)]
        );
    }

    public function test_ID_DELETE()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);

        $res = $this->actingAs($admin)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(204, $this->response->status());

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.delstudent","msg"=>"Cannot delete users of this exam"]
            ]
        );

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $exam_user->getRights()->setCanDeleteExamStudent(true);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(204, $this->response->status());
    }
}
