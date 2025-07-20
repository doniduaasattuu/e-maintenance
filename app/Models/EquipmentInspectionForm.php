<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EquipmentInspectionForm extends Model
{
    protected $table = 'equipment_inspection_forms';

    protected $fillable = [
        'equipment_id',
        'formable_id',
        'formable_type',
    ];

    public function formable()
    {
        return $this->morphTo();
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }
}
