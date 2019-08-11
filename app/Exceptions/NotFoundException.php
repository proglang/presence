<?php

namespace App\Exceptions;

use App\Http\Response\Response;
class NotFoundException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("404", "NotFound Exception");
    }
}