<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$router->group(['prefix' => ''], function ($router) {
    //! /auth
    $router->group(['prefix' => 'user'], function ($router) {
        $router->post('login', ['uses' => 'AuthController@login', 'res' => 'UserResource']);
        $router->post('register', ['uses' => 'AuthController@register', 'res' => 'UserResource']);

        $router->group(['middleware' => 'auth'], function ($router) {
            $router->post('login/jwt', ['uses' => 'AuthController@jwtlogin', 'res' => 'UserResource']);
            $router->get('logout', ['uses' => 'AuthController@logout', 'res' => '']);
            $router->delete('/', ['uses' => 'AuthController@delete', 'res' => 'delete']);
            $router->get('/', ['uses' => 'AuthController@get', 'res' => 'UserResource']);
        });
    });
    $router->group(['middleware' => 'auth'], function ($router) {
        //! /exam
        $router->group(['prefix' => 'exam'], function ($router) {
            $router->post('/', ['uses' => 'ExamController@create',  'res' => 'ExamResource']);
            $router->get('/', ['uses' => 'ExamController@list', 'res' => 'ExamResource[]']);
            //! /exam/${exam_id}
            $router->group(['prefix' => '{exam_id:[0-9]+}'], function ($router) {
                $router->put('/', ['uses' => 'ExamController@update', 'res' => 'ExamResource']);
                $router->get('/', ['uses' => 'ExamController@get', 'res' => 'ExamResource']);
                $router->delete('/', ['uses' => 'ExamController@delete', 'res' => '']);

                //! /exam/${exam_id}/user
                $router->group(['prefix' => 'user'], function ($router) {
                    $router->post('/', ['uses' => 'ExamUserController@add', 'res' => 'ExamUserResource']);
                    $router->get('/', ['uses' => 'ExamUserController@list', 'res' => 'ExamUserResource[]']);
                    //! /exam/${exam_id}/user/${user_id}
                    $router->group(['prefix' => '{user_id:[0-9]+}'], function ($router) {
                        $router->put('/', ['uses' => 'ExamUserController@update', 'res' => 'ExamUserResource']);
                        $router->get('/', ['uses' => 'ExamUserController@get', 'res' => 'ExamUserResource']);
                        $router->delete('/', ['uses' => 'ExamUserController@delete', 'res' => '']);
                    });
                });

                //! /exam/${exam_id}/room
                $router->group(['prefix' => 'room'], function ($router) {
                    $router->post('/', ['uses' => 'ExamRoomController@add', 'res' => 'ExamRoomResource']);
                    $router->get('/', ['uses' => 'ExamRoomController@list', 'res' => 'ExamRoomResource[]']);
                    //! /exam/${exam_id}/room/${room_id}
                    $router->group(['prefix' => '{room_id:[0-9]+}'], function ($router) {
                        $router->put('/', ['uses' => 'ExamRoomController@update', 'res' => 'ExamRoomResource']);
                        $router->get('/', ['uses' => 'ExamRoomController@get', 'res' => 'ExamRoomResource']);
                        $router->delete('/', ['uses' => 'ExamRoomController@delete', 'res' => '']);
                    });
                });

                //! /exam/${exam_id}/student
                $router->group(['prefix' => 'student'], function ($router) {
                    //! /exam/${exam_id}/room/${student_id}
                    $router->post('/', ['uses' => 'ExamStudentController@add', 'res' => 'ExamStudentResource']);
                    $router->get('/', ['uses' => 'ExamStudentController@list', 'res' => 'ExamStudentResource[]']);
                    $router->group(['prefix' => '{student_id:[0-9]+}'], function ($router) {
                        $router->put('/presence', ['uses' => 'ExamStudentController@setPresence', 'res' => 'ExamStudentResource']);
                        $router->put('/', ['uses' => 'ExamStudentController@update', 'res' => 'ExamStudentResource']);
                        $router->get('/', ['uses' => 'ExamStudentController@get', 'res' => 'ExamStudentResource']);
                        $router->delete('/', ['uses' => 'ExamStudentController@delete', 'res' => '']);
                    });
                });
                //! /exam/${exam_id}/log
                $router->group(['prefix' => 'log'], function ($router) {
                    $router->post('/{student_id:[0-9]+}', ['uses' => 'ExamLogController@add', 'res' => 'ExamLogResource']);
                    $router->post('/', ['uses' => 'ExamLogController@add', 'res' => 'ExamLogResource']);
                    $router->get('/', ['uses' => 'ExamLogController@list', 'res' => 'ExamLogResource[]']);
                    $router->group(['prefix' => '{note_id:[0-9]+}'], function ($router) {
                        $router->put('/', ['uses' => 'ExamLogController@update', 'res' => 'ExamLogResource']);
                        $router->get('/', ['uses' => 'ExamLogController@get', 'res' => 'ExamLogResource']);
                        $router->delete('/', ['uses' => 'ExamLogController@delete', 'res' => '']);
                    });
                });
            });
        });
    });
    $router->get('/', ['uses'=>'ApiController@version', 'res'=>'version']);
});
