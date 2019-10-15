<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserCollection extends Migration
{
    static $table = 'users';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->increments('id');
            $collection->string('name')->default('');
            $collection->string('email');
            $collection->string('email_hash')->unique();
            $collection->string('token');

            $collection->string('password')->nullable()->default(null);
            $collection->boolean('verified')->default(false);
            $collection->boolean('temporary')->default(false);

            $collection->timestampsTz();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::collection(self::$table, function (Blueprint $collection) {
            $collection->drop();
        });
    }
}
