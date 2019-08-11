<?php

namespace tests\api;

use \App\Models\User;
use App\Models\Exam;
use App\Models\ExamUser;

class ExamRouteTest extends TestCase
{
    //! exam/*/{?id}

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

        $exam = Exam::where([['name', $exam->name], ['date', $exam->date]])->first();
        //$this->assertEquals(201, $this->response->status());
        $res->seeJson([
            'exam' => ['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date],
        ]);
    }
    public function test__GET()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);

        $res = $this->actingAs($user)->json('GET', '/exam');
        $res->seeJson([
            'exams' => [['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date]],
        ]);

        $user2 = factory(User::class)->create();
        $exams = factory(Exam::class, 5)->create(["creator_id" => $user2->id]);
        $sl = [];
        foreach ($exams as $exam) {
            $sl[] = ['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date];
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
            'exam' => ['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date],
        ]);

        $user2 = factory(User::class)->create();
        $res = $this->actingAs($user2)->json('GET', "/exam/$id");
        $res->seeJson([
            "error"=>["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user3->id, 'rights'=>0]);
        $res = $this->actingAs($user3)->json('GET', "/exam/$id");
        $res->seeJson([
            "error"=>["useraccess.view"],
        ]);

        $user4 = factory(User::class)->create();
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user4->id, 'rights'=>1]);
        $res = $this->actingAs($user4)->json('GET', "/exam/$id");
        $res->seeJson([
            'exam' => ['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date],
        ]);


    }
    public function test_ID_PUT()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $exam_n = factory(Exam::class)->make();

        $id = $exam->id;
        $res = $this->actingAs($user)->json('PUT', "/exam/$id", ['name'=>$exam_n->name, 'date'=>$exam_n->date]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson([
            'exam' => ['name' => $exam_n->name, 'id' => $exam->id, 'date' => $exam_n->date],
        ]);


        $user2 = factory(User::class)->create();
        $res = $this->actingAs($user2)->json('PUT', "/exam/$id", ['name'=>$exam_n->name, 'date'=>$exam_n->date]);
        $this->assertEquals(404, $this->response->status());
        $res->seeJson([
            "error"=>["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user3->id, 'rights'=>0]);
        $res = $this->actingAs($user3)->json('PUT', "/exam/$id", ['name'=>$exam_n->name, 'date'=>$exam_n->date]);
        $this->assertEquals(403, $this->response->status());
        $res->seeJson([
            "error"=>["useraccess.update"],
        ]);

        $user4 = factory(User::class)->create();
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user4->id, 'rights'=>4]);
        $res = $this->actingAs($user4)->json('PUT', "/exam/$id", ['name'=>$exam->name, 'date'=>$exam->date]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson([
            'exam' => ['name' => $exam->name, 'id' => $exam->id, 'date' => $exam->date],
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
            "error"=>["404.exam"],
        ]);

        $user3 = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user3->id, 'rights'=>0]);
        $res = $this->actingAs($user3)->json('DELETE', "/exam/$id");
        $res->seeJson([
            "error"=>["useraccess.delete"],
        ]);

        $user4 = factory(User::class)->create();
        $exam = factory(Exam::class)->create(["creator_id" => $user->id]);
        $id = $exam->id;
        ExamUser::create(['exam_id'=>$exam->id, 'user_id'=>$user4->id, 'rights'=>2]);
        $res = $this->actingAs($user4)->json('DELETE', "/exam/$id");
        $this->assertEquals(204, $this->response->status());
     }
}
