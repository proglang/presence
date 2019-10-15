<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use App\Http\Response\Response;

class ServerException extends RenderExceptionBase implements IRenderException
{
    public function __construct($prev, $code)
    {
        $data = [
            "message" => $prev->getMessage(),
            "code" => $prev->getCode(),
            "line" => $prev->getLine(),
            "file" => $prev->getFile(),
            "trace" => $prev->getTraceAsString()
        ];
        parent::__construct('internal', 'Internal Server Error', $code, $data);
    }
    public function render(): Response
    {
        return $this->renderError("server", "Internal Server Error");
    }
}
