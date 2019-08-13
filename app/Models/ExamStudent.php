<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamStudent extends Model
{
    use Encryptable;

    protected $table = 'exam_student';
    public $incrementing = true;
    public $timestamps = false;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'ident',
        'exam_id'
    ];
    public function getNameAttribute($value) {
        return self::Decrypt($value);
    }
    public function setNameAttribute($value) {
        $this->attributes['name'] = self::Encrypt($value);
    }
    public function getIdentAttribute($value) {
        return self::Decrypt($value);
    }
    public function setIdentAttribute($value) {
        $this->attributes['ident'] = self::Encrypt($value);
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
    public function presence() {
        return $this->hasMany(StudentPresence::class, 'student_id', 'id')->latest('id');
    }
}
