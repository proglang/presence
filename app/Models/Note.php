<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model {
    use Encryptable;

    protected $table = 'notes';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'text',
        'note_id',
        'user_id',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function getTextAttribute($value) {
        return self::Decrypt($value);
    }
    public function setTextAttribute($value) {
        $this->attributes['text'] = self::Encrypt($value);
    }

    public function history() {
        return Note::where('note_id', $this->note_id);
    }
}
