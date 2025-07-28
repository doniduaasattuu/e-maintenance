<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InspectionPanel extends Model
{
    use HasFactory;

    protected $table = 'inspection_panels';

    protected $fillable = [
        'is_operational',
        'is_clean',
        'temperature_incoming_r',
        'temperature_incoming_s',
        'temperature_incoming_t',
        'temperature_cabinet',
        'temperature_outgoing_r',
        'temperature_outgoing_s',
        'temperature_outgoing_t',
        'current_r',
        'current_s',
        'current_t',
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
