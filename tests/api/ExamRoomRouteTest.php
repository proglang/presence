<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace tests\api;

use \App\Models\User;
use App\Models\Exam;
use App\Repositories\ExamUserRepository;
use App\Models\ExamRoom;

class ExamRoomRouteTest extends TestCase
{
    //! exam/*/room
    static protected function _getURL(int $exam_id, ?int $id = null)
    {
        $url =  "/exam/$exam_id/room";
        if ($id != null) {
            $url = "$url/$id";
        }
        return $url;
    }
    static protected function _getResult(ExamRoom $room, ?int $id = null)
    {
        return [
            'id' => $id == null ? $room->id : $id,
            'name' => $room->name,
            'note' => $room->note,
            'size' => $room->size
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
                "examrooms" => []
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
                "error" => ["useraccess.viewroom"]
            ]
        );


        $rooms = factory(ExamRoom::class, 2)->create(['exam_id' => $exam->id]);

        $result = [];
        foreach ($rooms as  $room) {
            $result[] = self::_getResult($room);
        }
        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examrooms" => $result
            ]
        );

        $exam_user->getRights()->setCanViewExamRoom(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examrooms" => $result
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

        $room = factory(ExamRoom::class)->make();

        $res = $this->actingAs($admin)->json('POST', self::_getURL($exam->id), ['name' => $room->name, 'note' => $room->note, 'size' => $room->size]);
        $er = ExamRoom::latest()->first();
        $this->assertEquals(201, $this->response->status());
        $res->seeJson(
            [
                "examroom" => self::_getResult($er)
            ]
        );

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), ['name' => $room->name, 'note' => $room->note, 'size' => $room->size]);
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
                "error" => ["useraccess.addroom"]
            ]
        );

        $exam_user->getRights()->setCanAddExamRoom(true);

        $room = factory(ExamRoom::class)->make();

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), ['name' => $room->name, 'note' => $room->note, 'size' => $room->size]);
        $er = ExamRoom::latest('id')->first();
        $this->assertEquals(201, $this->response->status());
        $res->seeJson(
            [
                    "examroom" => self::_getResult($er)
            ]
        );
    }

    public function test_ID_GET()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);
        $exam_id = $exam->id;

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam_id]);

        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id, $room->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                    "examroom" => self::_getResult($room)
            ]
        );

        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $room->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $room->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.viewroom"]
            ]
        );

        $exam_user->getRights()->setCanViewExamRoom(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $room->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                    "examroom" => self::_getResult($room)
            ]
        );
    }
    public function test_ID_PUT()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam->id]);
        $new_room = factory(ExamRoom::class)->make();

        $res = $this->actingAs($admin)->json('PUT', self::_getURL($exam->id, $room->id), ['name' => $new_room->name, 'size' => $new_room->size, 'note' => $new_room->note]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examroom" => self::_getResult($new_room, $room->id)
            ]
        );

        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $room->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["404.exam"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $room->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.update.room"]
            ]
        );

        $new_room = factory(ExamRoom::class)->make();
        $exam_user->getRights()->setCanUpdateExamRoom(true);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $room->id), ['name' => $new_room->name, 'size' => $new_room->size, 'note' => $new_room->note]);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examroom" => self::_getResult($new_room, $room->id)
            ]
        );
    }

    public function test_ID_DELETE()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam->id]);

        $res = $this->actingAs($admin)->json('DELETE', self::_getURL($exam->id, $room->id));
        $this->assertEquals(204, $this->response->status());

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam->id]);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $room->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["404.exam"]
            ]
        );

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam->id]);
        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $room->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["useraccess.delroom"]
            ]
        );

        $room = factory(ExamRoom::class)->create(['exam_id' => $exam->id]);
        $exam_user->getRights()->setCanDeleteExamRoom(true);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $room->id));
        $this->assertEquals(204, $this->response->status());
    }
}
