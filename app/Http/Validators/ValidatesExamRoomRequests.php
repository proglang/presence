<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;

trait ValidatesExamRoomRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamRoom(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|string',
            'note' => 'string',
            'size' => 'integer',
        ]);
    }
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamRoomUpdate(Request $request)
    {
        $this->validate($request, [
            'name' => 'string',
            'note' => 'string',
            'size' => 'integer',
        ]);
    }
}
