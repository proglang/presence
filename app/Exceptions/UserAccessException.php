<?php

namespace App\Exceptions;

use App\Http\Response\Response;
class UserAccessException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("useraccess", "UserAccessException");
    }
}