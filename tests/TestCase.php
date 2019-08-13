<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

namespace tests;

abstract class TestCase extends \Laravel\Lumen\Testing\TestCase
{

    public function setUp(): void
    {
        parent::setUp();
        $this->artisan('migrate:fresh --force');
    }
    public function tearDown(): void {
        parent::tearDown();
    }
    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__ . '/../bootstrap/app.php';
    }
}
