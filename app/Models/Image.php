<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $table = 'images';

    protected $fillable = [
        'path',
    ];

    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'equipment_image', 'image_id', 'equipment_id');
    }
}
