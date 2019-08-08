<?php

namespace App\Http\Controllers;
use App\Http\Response\ResponseHelper;

use Laravel\Lumen\Routing\Controller as BaseController;

use Illuminate\Http\Request;
use App\Http\Validators\Validator;

class Controller extends BaseController
{
    use ResponseHelper;
    public function validate(Request $request, array $rules, array $messages = [], array $customAttributes = [])
    {
        //  => trait ProvidesConvenienceMethods
        $validator = new Validator(app('translator'), $request->all(), $rules, $messages, $customAttributes);

        if ($validator->fails()) {
            $this->throwValidationException($request, $validator);
        }

        return $this->extractInputFromRules($request, $rules);
    }
}
