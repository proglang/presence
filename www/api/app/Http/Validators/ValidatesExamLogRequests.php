<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;

trait ValidatesExamLogRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateLogEntry(Request $request)
    {
        $this->validate($request, [
            'text' => 'required|string',
        ]);
    }
}
