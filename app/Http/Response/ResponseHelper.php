<?php
namespace App\Http\Response;

use Illuminate\Support\Facades\Auth;

trait ResponseHelper {
    protected static function createResponse($statusCode = 200, $headers = [], $auth=false):Response {
        if ($headers==null) {
            $headers = [];
        }
        $res = new Response();
        $res->setStatusCode($statusCode);
        $res->withHeaders($headers);
        if ($auth) {
            $res->withHeaders(["Authorization"=>"Bearer ".Auth::fromUser(Auth::user())]);
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
    protected static function respondSuccess()
    {
        return self::respond(null, 204);
    }
}