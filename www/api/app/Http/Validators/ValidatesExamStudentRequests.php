<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Validators;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

trait ValidatesExamStudentRequests
{
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamStudent(Request $request, int $exam_id)
    {
        $request->merge(['ident_hash'=>hash('sha256', $request->ident)]);
        $this->validate($request, [
            'name' => 'required|string',
            'ident'=> 'required|string',
            'ident_hash' => ['required',
                Rule::unique('exam_student','ident_hash')->where(function ($query) use($request, $exam_id) {
                    return $query->where('exam_id', $exam_id);
                }),
            ],
        ]);
    }
    /**
     * Validate login request input
     *
     * @param  Request $request
     * @throws \Illuminate\Auth\Access\ValidationException
     */
    protected function validateExamStudentUpdate(Request $request, int $exam_id, int $student_id)
    {
        if ($request->ident)
            $request->merge(['ident_hash'=>hash('sha256', $request->ident)]);
        $this->validate($request, [
            'name' => 'string',
            'ident'=> 'string',
            'ident_hash' => [
                Rule::unique('exam_student','ident_hash')->where(function ($query) use($request, $exam_id, $student_id) {
                    return $query->where('id','!=',  $student_id)->where('exam_id', $exam_id);
                }),
            ],
        ]);
    }
}
