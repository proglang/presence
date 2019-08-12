<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamStudentCollection extends Migration
{
    static $table = 'exam_student';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->increments('id');
            $collection->unsignedInteger('exam_id');
            $collection->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $collection->string('name')->default('');
            $collection->unsignedInteger('ident');

            $collection->unique(['id', 'ident']);
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
