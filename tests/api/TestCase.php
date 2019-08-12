<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

namespace tests\api;

use \App\Models\User;
use \Illuminate\Support\Facades\Auth;
use \Illuminate\Contracts\Auth\Authenticatable as UserContract;

abstract class TestCase extends \tests\TestCase
{
    // https://gist.github.com/jwalton512/e3b320bef85be88e8bd5
    /**
     * @var User
     */
    protected $user;
    /**
     * Set the currently logged in user for the application.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable $user
     * @param  string|null                                $driver
     * @return $this
     */
    public function actingAs(UserContract $user, $driver = null)
    {
        $this->user = $user;
        return $this;
    }
    /**
     * Call the given URI and return the Response.
     *
     * @param  string $method
     * @param  string $uri
     * @param  array  $parameters
     * @param  array  $cookies
     * @param  array  $files
     * @param  array  $server
     * @param  string $content
     * @return \Illuminate\Http\Response
     */
    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        if ($this->user) {
            Auth::guard('api')->onceUsingId($this->user->id);
            $server['HTTP_AUTHORIZATION'] = 'Bearer ' . Auth::guard('api')->fromUser(Auth::guard('api')->user());
        }
        $server['HTTP_ACCEPT'] = 'application/json';
        return parent::call($method, $uri, $parameters, $cookies, $files, $server, $content);
    }
    public function json($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        if ($this->user) {
            Auth::guard('api')->onceUsingId($this->user->id);
            $server['HTTP_AUTHORIZATION'] = 'Bearer ' . Auth::guard('api')->fromUser(Auth::guard('api')->user());
        }
        $server['HTTP_ACCEPT'] = 'application/json';
        return parent::json($method, $uri, $parameters, $cookies, $files, $server, $content);
    }
}
