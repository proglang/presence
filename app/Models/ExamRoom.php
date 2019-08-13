<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamRoom extends Model
{
    use Encryptable;
    protected $table = 'exam_room';
    public $incrementing = true;
    public $timestamps = true;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'note',
        'size',
        'exam_id'
    ];

    public function getNameAttribute($value) {
        return self::Decrypt($value);
    }
    public function setNameAttribute($value) {
        $this->attributes['name'] = self::Encrypt($value);
    }
    public function getNoteAttribute($value) {
        return self::Decrypt($value);
    }
    public function setNoteAttribute($value) {
        $this->attributes['note'] = self::Encrypt($value);
    }
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function exam() {
        return $this->hasOne(Exam::class, 'id', 'exam_id');
    }
}
