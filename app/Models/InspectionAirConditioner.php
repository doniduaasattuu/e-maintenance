<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionAirConditioner extends Model
{
    /** @use HasFactory<\Database\Factories\InspectionAirConditionerFactory> */
    use HasFactory;

    protected $table = 'inspection_air_conditioners';

    protected $fillable = [
        'is_operational',
        'is_drain_leaking',
        'current_load',
        'blowing_temperature',
        'ambient_temperature',
        'is_filter_clean',
        'is_evaporator_clean',
        'is_condensor_clean',
        'inspected_by',
    ];

    public function inspectionForm()
    {
        return $this->morphOne(EquipmentInspectionForm::class, 'formable');
    }

    public function inspectedBy(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
