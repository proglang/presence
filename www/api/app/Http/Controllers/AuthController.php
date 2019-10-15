<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Repositories\UserRepository;
use App\Repositories\AuthenticatedUserRepository;
use App\Exceptions\UserException;
use App\Http\Validators\ValidatesUserRequests;

class AuthController extends Controller
{
    use ValidatesUserRequests;
    /**
     * Get a JWT token via given credentials.
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return App\Http\Response\Response 
     */
    protected function getCredentials(Request $request)
    {

        return ['email_hash' => UserRepository::getMailHash($request->email), 'password' => ($request->password), 'temporary' => false];
    }

    public function login(Request $request)
    {
        $this->validateLogin($request);

        if (!$this->guard()->attempt($this->getCredentials($request))) {
            throw new UserException("unauthorized", "Invalid login data!", 401);
        }
        return self::createResponse(200, null, true)->addResource(AuthenticatedUserRepository::getUserResourceS());
    }

    public function jwtlogin()
    {
        return self::createResponse(200, null, true)->addResource(AuthenticatedUserRepository::getUserResourceS());
    }
    /**
     * User Registration
     *
     * @param  \Illuminate\Http\Request  $request
     *
     * @return App\Http\Response\Response
     */
    public function register(Request $request)
    {
        $this->validateRegister($request);
        $data = $request->only('email', 'password', 'name');
        $user = UserRepository::registerUser($data['email'], $data['name'], $data['password']);
        if (!$this->guard()->onceUsingId($user->getID())) {
            throw new UserException("unknown", "?", 500); // that should never happen
        }
        return self::createResponse(201, null, true)->addResource($user->getUserResource());
    }
    /**
     * User Registration if created by Exam owner
     *
     * @param int $user_id
     * @param string $token
     *
     * @return App\Http\Response\Response
     */
    public function verifyUser(int $user_id, string $token) // currently unused
    {
        $user = UserRepository::fromID($user_id);
        if (!$user->verify($token)) {
            throw new UserException("token", "Token invalid!", 422, $token);
        }
        if (!$this->guard()->onceUsingId($user->getID())) {
            throw new UserException("unknown", "?", 400, $token);
        }
        return self::createResponse(200, null, true)->addResource($user->getUserResource());
    }
    /**
     * Log the user out (Invalidate the token)
     *
     * @return App\Http\Response\Response
     */
    public function logout()
    {
        $this->guard()->logout();
        return $this->respondSuccess(false);
    }

    /**
     * Log the user out (Invalidate the token)
     *
     * @return App\Http\Response\Response
     */
    public function delete()
    {
        $res = AuthenticatedUserRepository::deleteS();
        return self::createResponse(200, null, false)->addJson('delete', $res);
    }

    /**
     * Refresh a token.
     *
     * @return App\Http\Response\Response
     */
    public function refresh()
    {
        $this->guard()->refresh($this->guard()->getToken());
        return self::createResponse(204, null, true);
    }

    /**
     * Get the current user
     *
     * @return App\Http\Response\Response
     */
    public function get()
    {
        return self::createResponse(200)->addResource(AuthenticatedUserRepository::getUserResourceS());
    }

    /**
     * Get the guard to be used during authentication.
     *
     * @return \Illuminate\Contracts\Auth\Guard
     */
    public function guard()
    {
        return Auth::guard('api');
    }
}
