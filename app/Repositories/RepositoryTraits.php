<?php

namespace App\Repositories;

trait RepositoryTrait {
    protected static function toUserRepository($user) {
        if (!($user instanceof UserRepository)) {
            $user = UserRepository::fromID($user);
        }
        return $user;
    }
    protected static function toExamRepository($exam) {
        if (!($exam instanceof ExamRepository)) {
            $exam = ExamRepository::fromID($exam);
        }
        return $exam;
    }
}