<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamUser extends Model
{
    use CompositeKeyModelHelper;

    protected $table = 'exam_user';
    public $incrementing = false;
    public $timestamps = false;
    protected $primaryKey = ['user_id', 'exam_id'];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'rights',
        'user_id',
        'exam_id',
        'note'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }
    public function exam() {
        return $this->hasOne(Exam::class, 'id', 'exam_id');
    }
    public function token() {
        return $this->hasOne(UserToken::class, 'user_id', 'user_id');
    }
}
