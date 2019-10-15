<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;

class ExamRoomResource extends Resource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'examroom';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {

        return [
            'id' => $this->id,
            'name'  => $this->name,
            'note' => $this->note,
            'size' => $this->size,
        ];
    }
}