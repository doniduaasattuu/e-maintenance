<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionMotor extends Model
{
    use HasFactory;

    protected $table = 'inspection_motors';

    protected $fillable = [
        'is_operational',
        'is_clean',
        'number_of_greasing',
        'temperature_de',
        'temperature_body',
        'temperature_nde',
        'vibration_dev',
        'vibration_deh',
        'vibration_dea',
        'vibration_def',
        'is_noisy_de',
        'vibration_ndev',
        'vibration_ndeh',
        'vibration_ndef',
        'is_noisy_nde',
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
