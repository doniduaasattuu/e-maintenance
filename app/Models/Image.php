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

    public function equipmentImages()
    {
        return $this->hasMany(EquipmentImage::class, 'image_id');
    }

    public function equipments()
    {
        return $this->belongsToMany(Equipment::class, 'equipment_images', 'image_id', 'equipment_id');
    }
}
