<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;

trait ValidatesExamStudentRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamStudent(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'ident' => 'required|integer',
        ]);
    }
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamStudentUpdate(Request $request)
    {
        $this->validate($request, [
            'name' => 'string',
            'ident' => 'integer',
        ]);
    }
}
