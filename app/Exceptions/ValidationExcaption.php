<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use App\Http\Response\Response;
class ValidationException extends RenderExceptionBase implements IRenderException{

    public function __construct($human, $err, $args)
    {
        $data = [
            'text' => $human,
            'keys'=>$err,
            'args'=>$args
        ];
        parent::__construct('error','Validation Error', 422, '', $data);
    }
    public function render():Response {
        return $this->renderError("validation", "ValidationException");
    }
}