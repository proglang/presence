<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


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