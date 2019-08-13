<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\Resource;
use App\Repositories\ExamUserRightsRepository;

class ExamUserResource extends Resource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'examuser';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $eu = ExamUserRightsRepository::fromID($this->exam_id, $this->user_id);

        return [
            'id' => $this->user_id,
            'name'  => $this->user->name,
            'note' => $this->note ?? '',
            'rights' => $eu->list()
        ];
    }
}