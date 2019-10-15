<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExamNoteRef extends Model
{
    use SoftDeletes;

    protected $table = 'exam_note_ref';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'exam_id',
        'student_id',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [];

    public function student() {
        $res = $this->hasOne(ExamStudent::class, 'id', 'student_id')->first();
        return $res==null?null:$res->id;
    }
    public function current() {
        return $this->hasMany(Note::class, 'note_id', 'id')->latest('id')->first();
    }
    public function history() {
        return $this->hasMany(Note::class, 'note_id', 'id');
    }
    public function historyCount() {
        return $this->hasMany(Note::class, 'note_id', 'id')->count()-1;
    }
}
