<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionTransformer extends Model
{
    /** @use HasFactory<\Database\Factories\InspectionTransformerFactory> */
    use HasFactory;

    protected $table = 'inspection_transformers';

    protected $fillable = [
        'is_operational',
        'is_clean',
        'primary_current_r',
        'primary_current_s',
        'primary_current_t',
        'primary_voltage_r',
        'primary_voltage_s',
        'primary_voltage_t',
        'secondary_current_r',
        'secondary_current_s',
        'secondary_current_t',
        'secondary_voltage_r',
        'secondary_voltage_s',
        'secondary_voltage_t',
        'temperature_oil',
        'temperature_winding',
        'desicant_level_id',
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
