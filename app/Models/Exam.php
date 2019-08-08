<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{

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
}
