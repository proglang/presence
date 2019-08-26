<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Models;

use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class User extends Model implements JWTSubject, AuthenticatableContract
{
    use Authenticatable;
    use Encryptable;

    protected $table = 'users';
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
        'temporary',
        'email_hash'
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
        'temporary',
        'email_hash'
    ];

    public function getEmailAttribute($value) {
        return self::Decrypt($value);
    }
    public function setEmailAttribute($value) {
        $this->attributes['email'] = self::Encrypt($value);
        $this->attributes['email_hash'] = hash("sha256", strtolower($value));
    }
    public function getNameAttribute($value) {
        return self::Decrypt($value);
    }
    public function setNameAttribute($value) {
        $this->attributes['name'] = self::Encrypt($value);
    }

    public function setPasswordAttribute($pass)
    {
        if ($pass!=null) {
            $this->attributes['password'] = Hash::make($pass);
        }else {
            $this->attributes['password'] = $pass;
        }
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
        return ["token" => $this->token];
    }

    public function exam($id = null)
    {
        //->whereRaw("rights % 2 = 1")
        $ret = $this->belongsToMany(Exam::class, 'exam_user', 'user_id', 'exam_id');
        if ($id != null) {
            return $ret->whereRaw('rights & ? = ?', [$id, $id]);
        }
        return $ret;
    }
}
