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
use App\Models\ExamNoteRef;
use App\Models\Note;

class ExamLogRouteTest extends TestCase
{
    //! exam/*/log
    static protected function _getURL(int $exam_id, ?int $id = null)
    {
        $url =  "/exam/$exam_id/log";
        if ($id != null) {
            $url = "$url/$id";
        }
        return $url;
    }
    static protected function _getResult(ExamNoteRef $enr, ?string $text = null, bool $history = false)
    {
        $enr->refresh();
        $ret = [
            'id' => $enr->id,
            'text' => $text == null ? $enr->current()->text : $text,
            'date' => (new \Carbon\Carbon($enr->current()->updated_at))->timestamp,
            'user' => User::find($enr->current()->user_id)->name,
            'history' => $enr->historyCount(),
            'student' => $enr->student()
        ];
        if ($history) {
            $ret['history.data'] = [];
            foreach ($enr->history as $note) {
                $ret['history.data'][] = [
                    'id' => $note->id,
                    'text' => $note->text,
                    'user' => User::find($note->user_id)->name,
                    'date' => (new \Carbon\Carbon($note->updated_at))->timestamp,
                ];
            }
        }
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
                "examlogs" => []
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
                "error" => ["code"=>"useraccess.viewlog", "msg"=>"Cannot view log of this exam"]
            ]
        );


        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);
        $n2 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);

        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);
        $enr2 = ExamNoteRef::create(['exam_id' => $exam->id, 'student_id' => $student->id]);
        factory(Note::class)->create(['note_id' => $enr2->id, 'user_id' => $user->id]);


        $result = [];
        $result[] = self::_getResult($enr, $n2->text);
        $result[] = self::_getResult($enr2);

        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlogs" => $result
            ]
        );

        $exam_user->getRights()->setCanViewExamLog(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlogs" => $result
            ]
        );
    }

    public function test__POST()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);
        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);

        $note = factory(Note::class)->make();

        $res = $this->actingAs($admin)->json('POST', self::_getURL($exam->id), ['text' => $note->text]);
        $this->assertEquals(201, $this->response->status());

        $enr = ExamNoteRef::latest('id')->first();

        $res->seeJson([
            "examlog" => self::_getResult($enr)
        ]);


        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), ['text' => $note->text]);
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
                "error" => ["code"=>"useraccess.addlog", "msg"=>"Cannot add logentry to exam"]
            ]
        );

        $exam_user->getRights()->setCanAddExamLog(true);

        $note = factory(Note::class)->make();

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id), ['text' => $note->text]);
        $this->assertEquals(201, $this->response->status());

        $enr = ExamNoteRef::latest('id')->first();

        $res->seeJson([
            "examlog" => self::_getResult($enr)
        ]);
    }
    public function test__POST_STUDENT()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);
        $student = factory(ExamStudent::class)->create(['exam_id' => $exam->id]);

        $note = factory(Note::class)->make();

        $res = $this->actingAs($admin)->json('POST', self::_getURL($exam->id, $student->id), ['text' => $note->text]);
        $this->assertEquals(201, $this->response->status());

        $enr = ExamNoteRef::latest('id')->first();

        $res->seeJson([
            "examlog" => self::_getResult($enr)
        ]);


        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id, $student->id), ['text' => $note->text]);
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id, $student->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.addlog", "msg"=>"Cannot add logentry to exam"]
            ]
        );

        $exam_user->getRights()->setCanAddExamLog(true);

        $note = factory(Note::class)->make();

        $res = $this->actingAs($user)->json('POST', self::_getURL($exam->id, $student->id), ['text' => $note->text]);
        $this->assertEquals(201, $this->response->status());

        $enr = ExamNoteRef::latest('id')->first();

        $res->seeJson([
            "examlog" => self::_getResult($enr)
        ]);
    }
    public function test_ID_GET()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);
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
                "error" => ["code"=>"useraccess.viewlog", "msg"=>"Cannot view log of this exam"]
            ]
        );


        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);
        $n2 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);

        $result = self::_getResult($enr, $n2->text, true);

        $res = $this->actingAs($admin)->json('GET', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlog" => $result
            ]
        );

        $exam_user->getRights()->setCanViewExamLog(true);
        $res = $this->actingAs($user)->json('GET', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlog" => $result
            ]
        );
    }
    public function test_ID_PUT()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);


        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);

        $res = $this->actingAs($admin)->json('PUT', self::_getURL($exam->id, $enr->id), ['text' => 'test']);
        $enr = ExamNoteRef::latest('id')->first();

        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlog" => self::_getResult($enr)
            ]
        );

        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $enr->id), ['text' => 'test']);
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.update.log", "msg"=>"Cannot update logentries of this exam"]
            ]
        );

        $exam_user->getRights()->setCanUpdateExamLog(true);
        $res = $this->actingAs($user)->json('PUT', self::_getURL($exam->id, $enr->id), ['text' => 'test2']);
        $this->assertEquals(200, $this->response->status());
        $res->seeJson(
            [
                "examlog" => self::_getResult($enr, "test2")
            ]
        );
    }

    public function test_ID_DELETE()
    {
        $admin = factory(User::class)->create();
        $user = factory(User::class)->create();

        $exam = factory(Exam::class)->create(['creator_id' => $admin->id]);

        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);

        $res = $this->actingAs($admin)->json('DELETE', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(204, $this->response->status());

        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(404, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"404.exam", "msg"=>"Exam not found"]
            ]
        );

        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);
        $exam_user = ExamUserRepository::addUser($exam->id, $user->id);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(403, $this->response->status());
        $res->seeJson(
            [
                "error" => ["code"=>"useraccess.dellog", "msg"=>"Cannot delete log of this exam"]
            ]
        );

        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);
        $exam_user->getRights()->setCanDeleteExamLog(true);
        $res = $this->actingAs($user)->json('DELETE', self::_getURL($exam->id, $enr->id));
        $this->assertEquals(204, $this->response->status());

        $enr = ExamNoteRef::create(['exam_id' => $exam->id]);
        $n1 = factory(Note::class)->create(['note_id' => $enr->id, 'user_id' => $user->id]);

        $this->actingAs($admin)->json('GET', self::_getURL($exam->id));
        $js = json_decode($this->response->content());
        $this->assertEquals(count($js->examlogs), 3);

        $this->actingAs($admin)->json('GET', self::_getURL($exam->id), ['view' => 'deleted']);
        $js = json_decode($this->response->content());
        $this->assertEquals(count($js->examlogs), 2);

        $this->actingAs($admin)->json('GET', self::_getURL($exam->id), ['view' => 'all']);
        $js = json_decode($this->response->content());
        $this->assertEquals(count($js->examlogs), 5);
    }
}
