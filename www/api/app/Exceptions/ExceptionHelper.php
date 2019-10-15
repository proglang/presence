<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use ErrorException;
use Exception;

use App\Http\Response\ResponseHelper;
use App\Http\Response\Response;

interface IRenderException
{
    public function render(): Response;
}
trait ExceptionHelper
{
    static protected function toResponse(Exception $error, $errorclass, $msg, $machineMsg, $data = null, $args = null, int $code = null): Response
    {
        $code = $code == null ? $error->getCode() : $code;
        $ret = self::createResponse($code == 0 ? 500 : $code);

        $error_data = [];
        if ($msg) {
            $error_data["msg"] =  $msg;
        }
        if ($error->getMessage()) {
            $error_data["msg"] = $error->getMessage();;
        }
        if (config('app.debug') == true) {
            $error_data["debug"] = [
                "data" => $data,
                "message" => $error->getMessage(),
                "code" => $error->getCode(),
                "line" => $error->getLine(),
                "file" => $error->getFile(),
                "trace" => $error->getTraceAsString()
            ];
        }
        if ($args != null)
            $error_data["args"] =  $args;
        if ($errorclass != null) {
            $error_data["code"] = $errorclass . "." . $machineMsg;
        } else {
            $error_data["code"] = $errorclass . "." . $machineMsg;
        }
        $ret->addJson("error", $error_data);
        return $ret;
    }
}
class RenderExceptionBase extends ErrorException
{
    use ResponseHelper;
    use ExceptionHelper;

    protected $machineMsg = null;
    protected $data = null;
    protected $args = null;
    public function __construct($machineMsg, $msg = null, $code = 500, $data = null, $args = null)
    {
        parent::__construct($msg, $code);
        $this->machineMsg = $machineMsg;
        $this->data = $data;
        $this->args = $args;
    }
    public function setMachineMessage(string $string)
    {
        $this->machineMsg = $string;
        return $this;
    }
    public function renderError(string $errorclass = null, string $msg = null): Response
    {
        return self::toResponse($this, $errorclass, $msg, $this->machineMsg, $this->data, $this->args);
    }
}
