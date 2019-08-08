<?php

namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;

class User extends Model implements JWTSubject, AuthenticatableContract
{
    use Authenticatable;

    protected $table = 'users';

    public static function boot() {
        parent::boot();
        static::created(function($user) {
            if (env('REGISTER_USE_VERIFICATION', false)!=true) {
                return;
            }
            UserToken::create([
                'user_id' => $user->id,
                'token' => str_replace("/", "_", base64_encode(random_bytes(40))),
            ]);
            // Todo: Send Create Event
        });
    }
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'token',
        'password',
        'verified',
        'temporary'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'token',
        'password',
        'verified',
        'temporary'
    ];

    public function setEmailAttribute($value) {
        $this->attributes['email'] = strtolower ($value);
    }
    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ["token"=>$this->token];
    }

    public function exam()
    {
        return $this->belongsToMany(Exam::class, 'exam_user', 'user_id', 'exam_id');
    }
    public function rights() {
        return $this->hasMany(ExamUser::class, 'user_id', 'id');
    }
}
