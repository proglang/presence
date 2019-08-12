<?php

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
            'id'    => 'required|integer',
            'note' => 'string',
            'level' => 'string',
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
            'level' => 'string',
            'rights' => 'array',
        ]);
    }
}
