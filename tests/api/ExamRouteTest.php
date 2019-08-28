<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace tests\api;

use App\Exceptions\NotFoundException;
use \App\Models\User;
use App\Models\Exam;
use App\Models\ExamUser;
use App\Repositories\ExamUserRepository;

class ExamRouteTest extends TestCase
{
    //! exam/*/{?id}

    const rights = [
        "delete",

        "exam_adduser",
        "exam_viewuser",
        "exam_updateuser",
        "exam_deleteuser",

        "exam_addroom",
        "exam_viewroom",
        "exam_updateroom",
        "exam_deleteroom",

        "exam_addstudent",
        "exam_viewstudent",
        "exam_updatestudent",
        "exam_updatestudent_presence",
        "exam_deletestudent",

        'exam_viewlog',
        'exam_addlog',
        'exam_deletelog',
        'exam_updatelog',

        "update",
        "view",
    ];

    static protected function _getResult(Exam $exam, User $user, Exam $exam2 = null)
    {
        $exam_user = null;
        $rights = null;
        try {
            $exam_user = ExamUserRepository::fromID($exam->id, $user->id);
        } catch (NotFoundException $e) {
            $rights = [];
            foreach (self::rights as $value) {
                $rights[$value] = true;
            }
        }

        $ret = [
            'id' => $exam->id,
            'name' => $exam2 ? $exam2->name : $exam->name,
            'date' => (new \Carbon\Carbon($exam2 ? $exam2->date : $exam->date))->timestamp,
            'rights' => $rights ? $rights : $exam_user->getRights()->list()
        ];
        return $ret;
    }

    /**
     * A basic test example.
     *
     * @return void
     */
    public function test__POST()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->make();
        $res = $this->actingAs($user)->json('POST', '/exam', ['name' => $exam->name, 'date' => $exam->date]);

        $exam = Exam::latest('id')->first();
        $this->assertEquals(201, $this->response->status());

        $res->seeJson([
            'exam' => self::_getResult($exam, $user)
        ]);
    }
    public function test__GET()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);

        $res = $this->actingAs($user)->json('GET', '/exam');
        $res->seeJson([
            'exams' => [self::_getResult($exam, $user)],
        ]);

        $user2 = factory(User::class)->create();
        $exams = factory(Exam::class, 5)->create(["creator_id" => $user2->id]);
        $sl = [];
        foreach ($exams as $exam) {
            $sl[] = self::_getResult($exam, $user);
        }
        $res = $this->actingAs($user2)->json('GET', '/exam');
        $res->seeJson([
            'exams' => $sl,
        ]);
    }
    public function test_ID_GET()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);


        $id = $exam->id;
        $res = $this->actingAs($user)->json('GET', "/exam/$id");
        $res->seeJson([
            'exam' => self::_getResult($exam, $user),
        ]);

        $user2 = factory(User::class)->create();
        $res = $this->actingAs($user2)->json('GET', "/exam/$id");
        $res->seeJson([
            "error" => ["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user3->id, 'rights' => 0]);
        $res = $this->actingAs($user3)->json('GET', "/exam/$id");
        $res->seeJson([
            "error" => ["useraccess.view"],
        ]);

        $user4 = factory(User::class)->create();
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user4->id, 'rights' => 1]);
        $res = $this->actingAs($user4)->json('GET', "/exam/$id");
        $res->seeJson([
            'exam' => self::_getResult($exam, $user4),
        ]);
    }
    public function test_ID_PUT()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $exam_n = factory(Exam::class)->make();

        $id = $exam->id;
        $res = $this->actingAs($user)->json('PUT', "/exam/$id", ['name' => $exam_n->name, 'date' => $exam_n->date]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson([
            'exam' => self::_getResult($exam, $user, $exam_n),
        ]);


        $user2 = factory(User::class)->create();
        $res = $this->actingAs($user2)->json('PUT', "/exam/$id", ['name' => $exam_n->name, 'date' => $exam_n->date]);
        $this->assertEquals(404, $this->response->status());
        $res->seeJson([
            "error" => ["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user3->id, 'rights' => 0]);
        $res = $this->actingAs($user3)->json('PUT', "/exam/$id", ['name' => $exam_n->name, 'date' => $exam_n->date]);
        $this->assertEquals(403, $this->response->status());
        $res->seeJson([
            "error" => ["useraccess.update"],
        ]);

        $user4 = factory(User::class)->create();
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user4->id, 'rights' => 4]);
        $res = $this->actingAs($user4)->json('PUT', "/exam/$id", ['name' => $exam->name, 'date' => $exam->date]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson([
            'exam' =>  self::_getResult($exam, $user4),
        ]);
    }
    public function test_ID_DELETE()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        $res = $this->actingAs($user)->json('DELETE', "/exam/$id");
        $this->assertEquals(204, $this->response->status());

        $user2 = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        $res = $this->actingAs($user2)->json('DELETE', "/exam/$id");
        $res->seeJson([
            "error" => ["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user3->id, 'rights' => 0]);
        $res = $this->actingAs($user3)->json('DELETE', "/exam/$id");
        $res->seeJson([
            "error" => ["useraccess.delete"],
        ]);

        $user4 = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        ExamUser::create(['exam_id' => $exam->id, 'user_id' => $user4->id, 'rights' => 2]);
        $res = $this->actingAs($user4)->json('DELETE', "/exam/$id");
        $this->assertEquals(204, $this->response->status());
    }
}
