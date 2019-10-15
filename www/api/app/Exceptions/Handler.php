<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use Exception;
use Illuminate\Validation\ValidationException as _ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Laravel\Lumen\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Http\Response\ResponseHelper;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class Handler extends ExceptionHandler
{
    use ResponseHelper;
    use ExceptionHelper;
    /**
     * A list of the exception types that should not be reported.
     *
     * @var array
     */
    protected $dontReport = [
        AuthorizationException::class,
        HttpException::class,
        ModelNotFoundException::class,
        _ValidationException::class,
        IRenderException::class
    ];

    /**
     * Report or log an exception.
     *
     * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
     *
     * @param  \Exception  $exception
     * @return void
     */
    public function report(Exception $exception)
    {
        parent::report($exception);
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Exception  $exception
     * @return \Illuminate\Http\Response|\Illuminate\Http\JsonResponse
     */
    public function render($request, Exception $exception)
    {
        $html = (config('app.debug') == true) ? parent::render($request, $exception)->original : null;
        if ($exception instanceof IRenderException) {
            $response = $exception->render();
            if ($html != null)
                $response->addJson("errorHTML", $html);
            return $response;
        }
        if ($exception instanceof _ValidationException) {
            foreach ($exception->validator->failed() as $key => $value) {
                foreach ($value as $vkey => $args) {
                    $err[] = "$key.$vkey";
                    $err_args["$key.$vkey"] = $args;
                }
            }
            $msg = [];
            foreach ($exception->validator->errors()->messages() as $key => $value) {
                $msg[] = $value;
            }
            return $this->render($request, new ValidationException($msg, $err, $err_args));
        }

        $code = 500;
        if ($exception instanceof NotFoundHttpException) 
            $code = 404;
        return $this->render($request, new ServerException($exception, $code));
    }
}
