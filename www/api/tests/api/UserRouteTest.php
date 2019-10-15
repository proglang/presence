<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace tests\api;

use \App\Models\User;

class UserRouteTest extends TestCase
{
    //! user/*

    public function test__GET()
    {
        $user = factory(User::class)->create();
        $res = $this->actingAs($user)->json('GET', '/user');
        $this->assertEquals(200, $this->response->status());
        $res->seeJson([
            'user' => ['email' => $user->email, 'name' => $user->name, 'id' => $user->id],
        ]);
    }

    public function test_register_POST()
    {
        $myuser = factory(User::class)->make();
        $pw = '#12AaBb45678901';

        $res = $this->json('POST', '/user/register', ['email' => $myuser->email, 'password' => $pw, 'name' => $myuser->name]);

        $this->assertEquals(201, $this->response->status());
        $this->seeInDatabase('users', ['email_hash' => $myuser->email_hash]);

        $user = User::where('email_hash', $myuser->email_hash);

        $this->assertArrayHasKey('Authorization', $this->response->headers->allPreserveCase());
        $this->assertEquals(1, $user->count());
        $user = $user->first();
        $res->seeJson([
            'user' => ['email' => $user->email, 'name' => $user->name, 'id' => $user->id],
        ]);

        //! Double Registration
        $res = $this->json('POST', '/user/register', ['email' => $myuser->email, 'password' => $pw, 'name' => $myuser->name]);
        $this->assertEquals(422, $this->response->status());
        $res->seeJson(
            ["error" =>
            [
                "args" =>
                [
                    "args" => ["email.Unique" => ["NULL", "email", "id", "users"]],
                    "keys" => ["email.Unique"],
                    "text" => [["The email hash has already been taken."]]
                ],
                "code" => "validation.error",
                "msg" => "Validation Error"
            ]]
        );

        $myuser = factory(User::class)->make();
        //! Password Errors
        //! not set/too short
        $res = $this->json('POST', '/user/register', ['email' => $myuser->email, 'password' => '', 'name' => $myuser->name]);
        $this->assertEquals(422, $this->response->status());
        $res->seeJson(
            ["error" =>
            [
                "args" =>
                [
                    "args" => ["password.Required" => []],
                    "keys" => ["password.Required"],
                    "text" => [["The password field is required."]]
                ],
                "code" => "validation.error",
                "msg" => "Validation Error"
            ]]
        );
        $res = $this->json('POST', '/user/register', ['email' => $myuser->email, 'password' => 'a', 'name' => $myuser->name]);
        $this->assertEquals(422, $this->response->status());
        $res->seeJson(
            [
                "code" => "validation.error",
                "msg" => "Validation Error"
            ]
        );
    }

    public function test_login_POST()
    {
        $pw = '#12AaBb45678901';
        $user = factory(User::class)->create(['password' => $pw]);

        // Successful Login
        $res = $this->json('POST', '/user/login', ['email' => $user->email, 'password' => $pw]);
        $res->seeJson([
            'user' => ['email' => $user->email, 'name' => $user->name, 'id' => $user->id],
        ]);

        // Failed Login -> Wrong Password
        $this->call('POST', '/user/login', ['email' => $user->email, 'password' => $pw . "2"]);
        $this->assertEquals(401, $this->response->status());

        // Failed Login -> Not Existing Email
        $this->call('POST', '/user/login', ['email' => $user->email . "abc", 'password' => $pw]);
        $this->assertEquals(401, $this->response->status());
    }

    public function test_verify_POST()
    {
        //Todo: Write Tests
        $this->assertEquals(1, 1);
    }
    public function test_verify_GET()
    {
        //Todo: Write Test
        $this->assertEquals(1, 1);
    }
    public function test_logout_GET()
    {
        $user = factory(User::class)->create();
        $this->actingAs($user)->call('GET', '/user');
        $this->actingAs($user)->call('GET', '/user/logout');
        $this->assertEquals(204, $this->response->status());
    }
}
