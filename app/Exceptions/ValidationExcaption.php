<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Exceptions;

use App\Http\Response\Response;

class ValidationException extends RenderExceptionBase implements IRenderException
{

    public function __construct($human, $err, $args)
    {
        $keys = [];
        foreach ($err as $key) {
            $newkey = str_replace("_hash", "", $key);
            if ($newkey != $key) {
                foreach ($args[$key] as $k => $v) {
                    if (gettype($v) == "string") {
                        $args[$key][$k] = str_replace("_hash", "", $v);
                    }
                }
                $args[$newkey] = array_merge($args[$newkey] ?? [], $args[$key]);
                unset($args[$key]);
            }
            $keys[] = $newkey;
        }
        $data = [
            'text' => $human,
            'keys' => $keys,
            'args' => $args
        ];
        parent::__construct('error', 'Validation Error', 422, '', $data);
    }
    public function render(): Response
    {
        return $this->renderError("validation", "ValidationException");
    }
}
