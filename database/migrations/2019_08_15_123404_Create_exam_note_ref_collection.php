<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExamNoteRefCollection extends Migration
{
    static $table = 'exam_note_ref';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->unsignedInteger('exam_id');
            $collection->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
    
            $collection->unsignedInteger('note_ref');
            $collection->foreign('note_ref')->references('id')->on('notes_ref')->onDelete('cascade');
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
