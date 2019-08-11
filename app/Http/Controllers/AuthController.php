<?php

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
    public function login(Request $request)
    {
        $this->validateLogin($request);

        $credentials = $request->only('email', 'password');
        if (!$this->guard()->attempt($credentials)) {
            throw new UserException("unauthorized", "Invalid login data!", 401);
        }
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
            throw new UserException("unknown", "?", 400);
        }
        return self::createResponse(201, null, true)->addResource($user->getUserResource());
    }
    /**
     * User Registration if created by Exam owner
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $user_id
     * @return App\Http\Response\Response 
     */
    public function register2(Request $request, int $user_id)
    {
        //Todo: Implement this
        $this->validateRegister2($request);
        $data = $request->only('password', 'name');
        return self::createResponse(501);
    }

    /**
     * User Registration if created by Exam owner
     *
     * @param int $user_id
     * @param string $token
     *
     * @return App\Http\Response\Response
     */
    public function verifyUser(int $user_id, string $token)
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
        return $this->respondSuccess();
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
