<?php

namespace App\Exceptions;

use App\Http\Response\Response;
class CreateException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("create", "CreateException");
    }
}