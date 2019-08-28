<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;

class Exam extends Model
{
    use Encryptable;
    protected $table = 'exams';

    /*public function getDateFormat()
    {
        return 'U';
    }*/

    //protected $table = 'exam';
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'date',
        'creator_id',
        'locked'
    ];

    public function getDateAttribute( $value) {
        return (new \Carbon\Carbon($value))->timestamp;
    }
    public function getNameAttribute($value) {
        return self::Decrypt($value);
    }
    public function setNameAttribute($value) {
        $this->attributes['name'] = self::Encrypt($value);
    }
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    // this is a recommended way to declare event handlers
    public static function boot() {
        parent::boot();
        static::created(function($exam) {
            ExamUser::create([
                'exam_id'=>$exam->id,
                'user_id'=>$exam->creator_id,
                'rights'=>0xffffffff,
                'note'=>'creator'
            ]);
        });
        static::deleted(function() { // after delete() method call this
            User::where('temporary', 1)->each(function($val) {
                try {
                    $val->delete();
                }catch(QueryException $e){};
            });
        });
    }

    public function user()
    {
        return $this->belongsToMany(User::class, 'exam_user','exam_id', 'user_id');
    }
    public function rooms()
    {
        return $this->hasMany(ExamRoom::class, 'exam_id', 'id');
    }
    public function students()
    {
        return $this->hasMany(ExamStudent::class, 'exam_id', 'id');
    }
    public function notes() {
        return $this->hasMany(ExamNoteRef::class, 'exam_id', 'id');
    }
    public function deletedNotes() {
        return $this->hasMany(ExamNoteRef::class, 'exam_id', 'id')->onlyTrashed();
    }
    public function allNotes() {
        return $this->hasMany(ExamNoteRef::class, 'exam_id', 'id')->withTrashed();
    }
}
