<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;
use App\Models\User;

class ExamStudentResource extends Resource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'examstudent';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $this->refresh(); // force reload of relations
        $ret = $this->presence->first();
        return [
            'id' => $this->id,
            'name'  => $this->name,
            'ident' => $this->ident,
            'present' => $ret == null ? false : $ret->present,
            'user' => $ret == null ? null : User::find($ret->user_id)->name,
        ];
    }
}
