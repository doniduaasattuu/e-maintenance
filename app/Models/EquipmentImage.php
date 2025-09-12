<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentImage extends Model
{
    protected $table = 'equipment_images';

    protected $fillable = [
        'equipment_id',
        'image_id',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function image()
    {
        return $this->belongsTo(Image::class, 'image_id');
    }
}
