<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

namespace App\Http\Response;

use Illuminate\Support\Facades\Auth;

trait ResponseHelper
{
    protected static function createResponse($statusCode = 200, $headers = null, $auth = false): Response
    {
        if ($headers == null) {
            $headers = [];
        }
        $res = new Response();
        $res->setStatusCode($statusCode);
        $res->withHeaders($headers);
        if ($auth) {
            $res->addJson('auth', "Bearer " . Auth::fromUser(Auth::user()));
            $res->withHeaders(["Authorization" => "Bearer " . Auth::fromUser(Auth::user())]);
        }
        return $res;
    }
    /**
     * Return generic json response with the given data.
     *
     * @param $data
     * @param int $statusCode
     * @param array $headers
     * @return \Illuminate\Http\JsonResponse
     */
    protected static function respond($data = null, $statusCode = 200, $headers = [])
    {
        return response($data, $statusCode, $headers);
    }

    /**
     * Respond with success.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected static function respondSuccess($auth = false)
    {
        return self::createResponse(204, null, $auth);
    }
}
