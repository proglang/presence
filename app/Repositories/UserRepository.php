<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


namespace App\Repositories;

use App\Exceptions\CreateException;
use App\Models\User;
use App\Models\Exam;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\QueryException;

class UserRepository extends BaseDatabaseRepository // implements IResponseRepository
{
    protected $user = null;
    public function __construct(User $user)
    {
        $this->user = $user;
    }
    static public function fromID(int $id): UserRepository
    {
        $exam = User::find($id);
        if ($exam == null) throw new NotFoundException("exam", "Exam not Found", 404, $id);
        return new UserRepository($exam);
    }
    public function get(): User
    {
        $this->assertValid();
        return $this->user;
    }
    protected static function _createUser(string $email): User
    {
        return new User([
            'email' => $email,
            'token' => str_replace("/", "_", base64_encode(random_bytes(30))),
            'verified' => (env('REGISTER_USE_VERIFICATION', false) != true)
        ]);
    }
    public function isValid(): bool
    {
        return $this->user != null;
    }
    public function getID(): int
    {
        $this->assertValid();
        return $this->user->id;
    }

    public function getName(): string
    {
        $this->assertValid();
        return $this->user->name;
    }
    public function setName(string $name, bool $save = true): UserRepository
    {
        $this->assertValid();
        $this->user->name = $name;
        if ($save) self::save($this->user);
        return $this;
    }

    public function hasPassword(): bool
    {
        $this->assertValid();
        return $this->user->password != null;
    }
    public function setPassword(string $password = null, bool $save = true): UserRepository
    {
        $this->assertValid();
        if ($password == null) {
            $this->user->password = null;
        } else {
            $this->user->password = $password;
        }
        if ($save) self::save($this->user);
        return $this;
    }
    public function getToken(): string
    {
        $this->assertValid();
        return $this->user->token;
    }
    public function setToken(string $token, bool $save = true): UserRepository
    {
        $this->assertValid();
        $this->user->token = $token;
        if ($save) self::save($this->user);
        return $this;
    }
    public function checkToken(string $token): bool
    {
        return $this->getToken() == $token;
    }
    public function isVerified(): bool
    {
        return $this->user->verified;
    }
    public function verify(string $token, bool $save = true): bool
    {
        if ($this->isVerified()) return false;
        if ($this->checkToken($token)) {
            $this->user->verified = true;
            $this->user->temporary = false;
            if ($save) self::save($this->user);
            return true;
        }
        return false;
    }

    public function getEmail(): string
    {
        $this->assertValid();
        return $this->user->email;
    }
    public function setEmail(string $mail, bool $save = true): UserRepository
    {
        $this->assertValid();
        $this->user->email = $mail;
        if ($save) self::save($this->user);
        return $this;
    }

    public static function registerUser(string $email, string $name, string $password): UserRepository
    {
        try {
            $user = self::_createUser($email);
            $user = new UserRepository($user);
            $user->setPassword($password, false)->setName($name, false);
            self::save($user->user);
        } catch (QueryException $e) {
            throw new CreateException("user", "Cannot Register User", 422, $e->getMessage());
        }
        return $user;
    }
    public function canCreateExam(): bool
    {
        $this->assertValid();
        return $this->user->verified;
    }
    public function createExam(string $name, int $date): ExamRepository
    {
        if (!$this->canCreateExam()) {
            throw ErrorException("Cannot create new exam");
        }
        return ExamRepository::create($this, $name, $date);
    }
    /**
     *
     * @return ExamRepository[]
     */
    public function getExams(): array
    {
        return array_map(function (Exam $exam) {
            return new ExamRepository($exam);
        }, $this->user->exam(1)->get()->all());
    }
    public function getUserResource()
    {
        return new UserResource($this->user);
    }
}

class AuthenticatedUserRepository extends UserRepository
{
    public function __construct(int $id = 0)
    {
        if ($id == 0) {
            parent::__construct(Auth::user());
        } else {
            parent::__construct(User::find($id));
        }
    }
    public static function checkTokenS(string $token)
    {
        return (new AuthenticatedUserRepository())->checkToken($token);
    }
    public static function getUserResourceS()
    {
        return (new AuthenticatedUserRepository())->getUserResource();
    }
}
