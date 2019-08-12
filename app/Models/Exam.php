<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    protected $table = 'exams';

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
        static::deleting(function($exam) { // before delete() method call this
            $exam->user->where('temporary', 1)->each(function($val) {
                if ($val->exam->count()==0) {
                    $val->delete();
                };
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
}
