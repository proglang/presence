<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;

trait ValidatesExamUserRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamUser(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email',
            'note' => 'string',
            'rights' => 'array',
        ]);
    }
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamUserUpdate(Request $request)
    {
        $this->validate($request, [
            'note' => 'string',
            'rights' => 'array',
        ]);
    }
}
