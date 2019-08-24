<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;

trait ValidatesExamRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExam(Request $request)
    {
        $this->validate($request, [
            'name'    => 'required|string',
            'date' => 'required|int',
        ]);
    }
}
