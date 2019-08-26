<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Resources;

use App\Repositories\AuthenticatedUserRepository;
use App\Repositories\AuthExamUserRightsRepository;
use Illuminate\Http\Resources\Json\Resource;

class ExamResource extends Resource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'exam';

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $eu = (new AuthExamUserRightsRepository($this->id));

        return [
            'id' => $this->id,
            'name'  => $this->name,
            'date' => $this->date,
            'rights' => $eu->list()
        ];
    }
}