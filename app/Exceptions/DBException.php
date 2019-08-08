<?php

namespace App\Exceptions;

use App\Http\Response\Response;
class DBException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("db", "DBException");
    }
}