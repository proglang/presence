<?php

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
    static protected function toResponse(Exception $error, $errorclass, $msg, $machineMsg, $data = null, $args = null): Response
    {
        $code = $error->getCode();
        $ret = self::createResponse($code == 0 ? 500 : $code);
        if ($msg) {
            $ret->addJsonArray("error.msg", $msg);
        }
        if ($error->getMessage()) {
            $ret->addJsonArray("error.msg", $error->getMessage());
        }
        if (env("APP_DEBUG", false)) {
            $ret->addJson("error.debug", [
                "data" => $data,
                "message" => $error->getMessage(),
                "code" => $error->getCode(),
                "line" => $error->getLine(),
                "file" => $error->getFile(),
                "trace" => $error->getTraceAsString()
            ]);
        }
        if ($args!=null)
            $ret->addJson("error.args", $args);
        if ($errorclass != null) {
            if (is_array($machineMsg)) {
                foreach ($machineMsg as  $value) {
                    $ret->addJsonArray("error", $errorclass . "." . $value);
                }
             } else {
                $ret->addJsonArray("error", $errorclass . "." . $machineMsg);
            }
        } else {
            $ret->addJsonArray("error", $machineMsg);
        }
        return $ret;
    }
}
class RenderExceptionBase extends ErrorException
{
    use ResponseHelper;
    use ExceptionHelper;

    protected $machineMsg = null;
    protected $data = null;
    public function __construct($machineMsg, $msg = null, $code = 500, $data = null)
    {
        parent::__construct($msg, $code);
        $this->machineMsg = $machineMsg;
        $this->data = $data;
    }
    public function setMachineMessage(string $string)
    {
        $this->machineMsg = $string;
        return $this;
    }
    public function renderError(string $errorclass = null, string $msg = null): Response
    {
        return self::toResponse($this, $errorclass, $msg, $this->machineMsg, $this->data);
    }
}
