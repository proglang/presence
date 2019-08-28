<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Controllers;

use App\Http\Controllers\Controller;

class ApiController extends Controller
{

    public function version()
    {
        return self::createResponse(200, null, false)
            ->addJson('version', ['lumen' => app()->version(), 'api' => '0.1.0']);
        //Todo: define a version variable
    }
    public function test()
    {
        return self::createResponse(200, null, false)
            ->addJson('test', 'test1');
    }
}
