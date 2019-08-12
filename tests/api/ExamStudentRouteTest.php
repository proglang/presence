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

class ExamStudentRouteTest extends TestCase
{
    //! exam/*/student
    static protected function _getURL(int $exam_id, ?int $id = null)
    {
        $url =  "/exam/$exam_id/student";
        if ($id != null) {
            $url = "$url/$id";
        }
        return $url;
    }
    static protected function _getResult(ExamStudent $student, ?int $id = null)
    {
        return [
            'id' => $id == null ? $student->id : $id,
            'name' => $student->name,
            'ident' => $student->ident,
        ];
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
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.viewstudent"]
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
        $er = ExamStudent::where([['name', $student->name], ['ident', $student->ident], ['exam_id', $exam->id]])->first();
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
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.addstudent"]
            ]
        );

        $exam_user->getRights()->setCanAddExamStudent(true);

        $student = factory(ExamStudent::class)->make();

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), self::_getResult($student));
        $er = ExamStudent::where([['name', $student->name], ['ident', $student->ident], ['exam_id', $exam->id]])->first();
        $this->assertEquals(201, $this->response->status());
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
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.viewstudent"]
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
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.update.student"]
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
                "error" => ["404.exam"]
            ]
        );

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.delstudent"]
            ]
        );

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $exam_user->getRights()->setCanDeleteExamStudent(true);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $student->id));
        $this->assertEquals(204, $this->response->status());
    }
}
