<?php

/*
 * Custom JWT authentication middleware since the original package does
 * not have a configurable option to change the authorization token name.
 *
 * The token name by default is set to 'bearer'.
 * The default middleware provided does not have any flexibility to
 * change the token name.
 *
 * This project api spec requires us to use the token name 'token'.
 */

namespace App\Http\Middleware;

use Closure;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

use App\Repositories\AuthenticatedUserRepository;
use Illuminate\Support\Facades\Auth;

class Authenticate extends BaseMiddleware
{
    function __construct(JWTAuth $auth) {
        parent::__construct($auth);
    }

    private const user_not_found = 0;
    private const disabled_token = 1;
    private const invalid_token = 2;
    private const expired_token = 3;
    private const unknown = 4;

    private const messages = [
        self::user_not_found=>'user not found',
        self::invalid_token=>'token invalid',
        self::expired_token=>'token expired',
        self::disabled_token=>'token disabled',
        self::unknown=>'unknown'
    ];
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @param bool $optional
     * @return mixed
     */
    public function handle($request, Closure $next, $optional = null)
    {
        if (true) { //Todo: Remove this
            Auth::onceUsingId(1);
            $token = Auth::fromUser(Auth::user());
            $request->headers->set('Authorization', "Bearer $token");
            return $next($request);
        }
        $this->auth->setRequest($request);
        try {
            if (!$this->auth->parseToken()->authenticate()) {
                return $this->handleException(self::user_not_found);
            }
            $payload = $this->auth->getPayload();
            $token = $payload->get('token');
            if (!AuthenticatedUserRepository::checkToken($token)) {
                return $this->handleException(self::disabled_token);
            }
            //if (!$this->user->getCurrent()->checkToken($token)) {
            //    return $this->handleException(self::disabled_token);
            //}
        } catch (TokenExpiredException $e) {
            return $this->handleException(self::expired_token);
        } catch (TokenInvalidException $e) {
            return $this->handleException(self::invalid_token);
        } catch (JWTException $e) {
            if ($optional === null) {
                return $this->handleException(self::unknown, $e->getMessage());
            }
        }
        return $next($request);
    }
    private function handleException($code, $msg = '') {
        $msg=self::messages[$code].": $msg";
        return response(
            [
                'error'=>[
                    'login'=>[
                        'code'=>$code,
                        'msg'=> $msg
                    ]
                ]
            ], 401);
    }
}
