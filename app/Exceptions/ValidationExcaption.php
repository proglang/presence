<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use App\Http\Response\Response;
class ValidationException extends RenderExceptionBase implements IRenderException{

    public function render():Response {
        return $this->renderError("validation", "ValidationException");
    }
}