<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use Carbon\Carbon;

class CreateExamCollection extends Migration
{
    static $table = 'exams';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->increments('id');
            $collection->string('name');
            $collection->unsignedBigInteger('date')->default(0);
            $collection->unsignedInteger('creator_id');
            $collection->boolean('locked');

            $collection->foreign('creator_id')->references('id')->on('users');

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
