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
        $router->post('login', 'AuthController@login');
        $router->post('register', 'AuthController@register');

        $router->group(['prefix' => 'verify/{user_id:[0-9]}'], function ($router) {
            $router->get('{token}', 'AuthController@verifyUser');
            $router->post('/', 'AuthController@register2');
        });

        $router->group(['middleware' => 'auth'], function ($router) {
            $router->post('login/jwt', 'AuthController@jwtlogin');
            $router->get('logout', 'AuthController@logout');
            $router->get('refresh', 'AuthController@refresh');
            $router->get('/', 'AuthController@get');
        });
    });
    $router->group(['middleware' => 'auth'], function ($router) {
         //! /exam
        $router->group(['prefix' => 'exam'], function ($router) {
            $router->post('/', 'ExamController@create');
            $router->get('/', 'ExamController@list');
            //! /exam/${exam_id}
            $router->group(['prefix' => '{exam_id:[0-9]+}'], function ($router) {
                $router->put('/', 'ExamController@update');
                $router->get('/', 'ExamController@get');
                $router->delete('/', 'ExamController@delete');

                //! /exam/${exam_id}/user
                $router->group(['prefix' => 'user'], function ($router) {
                    $router->post('/', 'ExamUserController@add');
                    $router->get('/', 'ExamUserController@list');
                    //! /exam/${exam_id}/user/${user_id}
                    $router->group(['prefix' => '{user_id:[0-9]+}'], function ($router) {
                        $router->put('/', 'ExamUserController@update');
                        $router->get('/', 'ExamUserController@get');
                        $router->delete('/', 'ExamUserController@delete');
                    });
                });

                //! /exam/${exam_id}/room
                $router->group(['prefix' => 'room'], function ($router) {
                    $router->post('/', 'ExamRoomController@add');
                    $router->get('/', 'ExamRoomController@list');
                    //! /exam/${exam_id}/room/${room_id}
                    $router->group(['prefix' => '{room_id:[0-9]+}'], function ($router) {
                        $router->put('/', 'ExamRoomController@update');
                        $router->get('/', 'ExamRoomController@get');
                        $router->delete('/', 'ExamRoomController@delete');
                    });
                });

                //! /exam/${exam_id}/student
                $router->group(['prefix' => 'student'], function ($router) {
                    //! /exam/${exam_id}/room/${student_id}
                    $router->post('/', 'ExamStudentController@add');
                    $router->get('/', 'ExamStudentController@list');
                    $router->group(['prefix' => '{student_id:[0-9]+}'], function ($router) {
                        $router->put('/presence', 'ExamStudentController@setPresence');
                        $router->put('/', 'ExamStudentController@update');
                        $router->get('/', 'ExamStudentController@get');
                        $router->delete('/', 'ExamStudentController@delete');
                    });
                });
                //! /exam/${exam_id}/log
                $router->group(['prefix' => 'log'], function ($router) {
                    $router->post('/{student_id:[0-9]+}', 'ExamLogController@add');
                    $router->post('/', 'ExamLogController@add');
                    $router->get('/', 'ExamLogController@list');
                    $router->group(['prefix' => '{note_id:[0-9]+}'], function ($router) {
                        $router->put('/', 'ExamLogController@update');
                        $router->get('/', 'ExamLogController@get');
                        $router->delete('/', 'ExamLogController@delete');
                    });
                });
            });
        });
    });
    $router->get('/', function () use ($router) {
        return $router->app->version();
    });
});