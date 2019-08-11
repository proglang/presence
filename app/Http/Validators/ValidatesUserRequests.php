<?php

namespace App\Http\Validators;

use Illuminate\Http\Request;

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
        $this->validate($request, [
            'name' => 'required|max:50|alpha_num',
            'email'    => 'required|email|max:255|unique:users,email',
            'password' => 'password',
        ]);
    }
    /**
     * Validate register request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateRegister2(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|max:50|alpha_num',
            'password' => 'password',
        ]);
    }
}
