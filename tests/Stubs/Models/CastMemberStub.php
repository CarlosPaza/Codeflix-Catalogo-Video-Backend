<?php

namespace Tests\Stubs\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;

class CastMemberStub extends Model
{
    protected $table = 'cast_member_stubs';
    protected $fillable = ['name'];

    public static function createTable() {
        \Schema::create('cast_member_stubs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->smallInteger('type');
            $table->timestamps();
        });
    }

    public static function dropTable() {
        \Schema::dropIfExists('cast_member_stubs');
    }
}