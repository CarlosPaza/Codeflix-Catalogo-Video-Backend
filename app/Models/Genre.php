<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use SoftDeletes, Traits\Uuid;

    public $incrementing = false;
    protected $fillable = ['name', 'is_active'];
    protected $dates = ['deleted_at'];
    protected $keyType = 'string';
    protected $casts = [
        'is_active' => 'boolean'
    ];
}
