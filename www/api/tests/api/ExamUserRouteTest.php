<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace tests\api;

use \App\Models\User;
use App\Models\Exam;
use App\Repositories\ExamUserRepository;

class ExamUserRouteTest extends TestCase
{
    //! user/*
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
    public function test__GET()
    {
        $rights = [];
        foreach (self::rights as $value) {
            $rights[$value] = true;
        }
        $rights2 = [];
        foreach (self::rights as $value) {
            $rights2[$value] = false;
        }

        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(['creator_id' => $user->id]);
        $exam_user = ExamUserRepository::fromID($exam->id, $user->id);
        $id = $exam->id;
        $res = $this->actingAs($user)->json('GET', "/exam/$id/user");
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examusers" => [
                    [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "note" => $exam_user->getNote(),
                        "rights" => $rights
                    ]
                ]
            ]
        );

        $user2 = factory(User::class)->create();
        $res = $this->actingAs($user2)->json('GET', "/exam/$id/user");
        $this->assertEquals(404, $this->response->status());

        $eu = ExamUserRepository::addUser($exam->id, $user2->id);
        $res = $this->actingAs($user2)->json('GET', "/exam/$id/user");
        $this->assertEquals(403, $this->response->status());

        $eu->getRights()->setCanViewExamUser(true);
        $res = $this->actingAs($user2)->json('GET', "/exam/$id/user");
        $this->assertEquals(200, $this->response->status());

        $exam_user2 = ExamUserRepository::fromID($exam->id, $user2->id);
        $_rights = $rights2;
        $_rights['exam_viewuser'] = true;
        $res->seeJson(
            [
                "examusers" => [
                    [
                        "id" => $user->id,
                        "name" => $user->name,
                        "email" => $user->email,
                        "note" => $exam_user->getNote(),
                        "rights" => $rights
                    ],
                    [
                        "id" => $user2->id,
                        "name" => $user2->name,
                        "email" => $user2->email,
                        "note" => $exam_user2->getNote(),
                        "rights" => $_rights
                    ]
                ]
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
        $rights2 = [];
        foreach (self::rights as $value) {
            $rights2[$value] = false;
        }

        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(['creator_id' => $user->id]);

        $user2 = factory(User::class)->create();
        // $exam_user = ExamUserRepository::fromID($exam->id, $user->id);
        $id = $exam->id;
        $res = $this->actingAs($user)->json('POST', "/exam/$id/user", ['email' => $user2->email, 'note' => 'Hello world!']);
        $this->assertEquals(201, $this->response->status());

        $exam_user2 = ExamUserRepository::fromID($exam->id, $user2->id);
        $res->seeJson(
            [
                "examuser" =>
                [
                    "id" => $user2->id,
                    "name" => $user2->name,
                    "email" => $user2->email,
                    "note" => $exam_user2->getNote(),
                    "rights" => $rights2
                ]
            ]
        );
        // Todo: Check if rights are correctly set
    }

    public function test_ID_GET()
    {

        $rights = [];
        foreach (self::rights as $value) {
            $rights[$value] = true;
        }

        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(['creator_id' => $user->id]);

        $id = $exam->id;
        $uid = $user->id;
        $res = $this->actingAs($user)->json('GET', "/exam/$id/user/$uid");
        $this->assertEquals(200, $this->response->status());

        $exam_user = ExamUserRepository::fromID($exam->id, $user->id);
        $res->seeJson(
            [
                "examuser" =>
                [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "note" => $exam_user->getNote(),
                    "rights" => $rights
                ]
            ]
        );
    }
    public function test_ID_PUT() {
        $rights = [];
        foreach (self::rights as $value) {
            $rights[$value] = true;
        }
        $rights2 = [];
        foreach (self::rights as $value) {
            $rights2[$value] = false;
        }

        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(['creator_id' => $user->id]);
        $id = $exam->id;
        $uid = $user->id;
        $res = $this->actingAs($user)->json('PUT', "/exam/$id/user/$uid");
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=> "useraccess.update.user.self", "msg"=>"You cannot update yourself!"]
            ]
        );
        $user2 = factory(User::class)->create();
        ExamUserRepository::addUser($exam->id, $user2->id);
        $uid = $user2->id;

        $res = $this->actingAs($user)->json('PUT', "/exam/$id/user/$uid", ['note'=>"abc"]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examuser" =>
                [
                    "id" => $user2->id,
                    "name" => $user2->name,
                    "email" => $user2->email,
                    "note" => 'abc',
                    "rights" => $rights2
                ]
            ]
        );
        // Todo: More testcases eg. user tries to update creator, set rights which the user doesn't posses etc.


    }
    public function test_ID_DELETE()
    {
        $user = factory(User::class)->create();
        $exam = factory(Exam::class)->create(['creator_id' => $user->id]);
        $id = $exam->id;
        $uid = $user->id;
        $res = $this->actingAs($user)->json('DELETE', "/exam/$id/user/$uid");
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=> "useraccess.deluser.self", "msg"=>"You cannot delete yourself!"]
            ]
        );

        $user2 = factory(User::class)->create();
        $exam_user2 = ExamUserRepository::addUser($exam->id, $user2->id);

        $res = $this->actingAs($user2)->json('DELETE', "/exam/$id/user/$uid");
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=> "useraccess.deluser", "msg"=>"Cannot delete users of this exam"]
            ]
        );

        $exam_user2->getRights()->setCanDeleteExamUser(true);

        $res = $this->actingAs($user2)->json('DELETE', "/exam/$id/user/$uid");
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=> "useraccess.deluser.creator", "msg"=>"Exam Creator cannot be deleted!"]
            ]
        );

        $uid = $user2->id;
        $res = $this->actingAs($user)->json('DELETE', "/exam/$id/user/$uid");
        $this->assertEquals(204, $this->response->status());

        $user3 = factory(User::class)->create();
        $user4 = factory(User::class)->create();
        $eu1 = ExamUserRepository::addUser($exam->id, $user3->id)->get();
        $eu2 = ExamUserRepository::addUser($exam->id, $user4->id)->get();
        $eu1->rights = 0xffffffff;
        $eu2->rights = 0xffffffff;
        $eu1->save();
        $eu2->save();
        
        $uid = $user3->id;
        $res = $this->actingAs($user4)->json('DELETE', "/exam/$id/user/$uid");
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=> "useraccess.deluser.samelv", "msg"=>"User cannot be deleted: Only creator can delete this user!"]
            ]
        );



    }
}
