<?php

namespace App\Exceptions;

use App\Http\Response\Response;
class UserException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("user", "UserException");
    }
}