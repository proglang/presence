<?php
// Copyright (c) 2019 Stefan Schweizer
// 
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotesCollection extends Migration
{
    static $table = 'notes';
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create(self::$table, function (Blueprint $collection) {
            $collection->increments('id');

            $collection->unsignedInteger('note_id');
            $collection->foreign('note_id')->references('id')->on('exam_note_ref')->onDelete('cascade');

            $collection->unsignedInteger('user_id');
            $collection->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $collection->string('text');
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
