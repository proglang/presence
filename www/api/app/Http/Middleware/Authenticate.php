<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


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

use App\Exceptions\AuthenticationException;
use Closure;
use Tymon\JWTAuth\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Http\Middleware\BaseMiddleware;

use App\Repositories\AuthenticatedUserRepository;

class Authenticate extends BaseMiddleware
{
    function __construct(JWTAuth $auth)
    {
        parent::__construct($auth);
    }
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
        $this->auth->setRequest($request);
        try {
            if (!$this->auth->parseToken()->authenticate()) {
                throw new AuthenticationException('user', "User Error", 401);
            }
            $user = (new AuthenticatedUserRepository());
            if ($user->isTemporary())
                throw new AuthenticationException('user', "User Error", 401);

            $payload = $this->auth->getPayload();
            $token = $payload->get('token');
            if (!$user->checkToken($token)) {
                throw new AuthenticationException('token.disabled', "Token disabled", 401);
            }
        } catch (TokenExpiredException $e) {
            throw new AuthenticationException('token.expired', "Token expired", 401);
        } catch (TokenInvalidException $e) {
            throw new AuthenticationException('token.invalid', "Token invalid", 401);
        } catch (JWTException $e) {
            if ($optional === null) {
                throw new AuthenticationException('unknown', "unknown Error", 401, $e->getMessage());
            }
        }
        return $next($request);
    }
}
