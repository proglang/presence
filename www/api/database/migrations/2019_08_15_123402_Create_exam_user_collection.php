<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamUserCollection extends Migration
{
    static $table = 'exam_user';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->unsignedInteger('user_id');
            $collection->foreign('user_id')->references('id')->on('users');
            $collection->unsignedInteger('exam_id');
            $collection->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $collection->unsignedInteger('rights')->default(0);
            $collection->string('note')->default('');

            $collection->primary(['user_id', 'exam_id']);
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
