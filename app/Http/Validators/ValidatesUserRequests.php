<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

trait ValidatesUserRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateLogin(Request $request)
    {
        $this->validate($request, [
            'email'    => 'required|email|max:255',
            'password' => 'password',
        ]);
    }

    /**
     * Validate register request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateRegister(Request $request)
    {
        $request->merge(['email_hash' => hash('sha256', $request->email)]);
        $this->validate($request, [
            'name' => 'required|max:50|string',
            'email'    => 'required|email|max:255',
            'email_hash' => [
                'required',
                Rule::unique('users', 'email_hash')->where(function ($query) {
                    return $query->where('temporary', false);
                }),
            ],
            'password' => 'password',
        ]);
    }
}
