<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Resources\Json\Resource;

class ExamLogResource extends Resource
{
    /**
     * The "data" wrapper that should be applied.
     *
     * @var string
     */
    public static $wrap = 'examlog';

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
            'text' => $this->current()->text,
            'date' => $this->current()->updated_at,
            'user' => User::find($this->current()->user_id)->name,
            'history' => $this->historyCount(),
            'student' => $this->student()
        ];
    }
}
class ExamLogHistoryResource extends ExamLogResource
{

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $ret = [];
        foreach ($this->history as $note) {
            $ret[] = [
                'id' => $note->id,
                'text' => $note->text,
                'user' => ['id' => $note->user_id, 'name' => User::find($note->user_id)->name],
                'date' => $note->updated_at
            ];
        }
        $data = parent::toArray($request);
        $data['history.data'] = $ret;
        return $data;
    }
}
