<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InspectionTransformerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'is_operational' => $this->is_operational,
            'is_clean' => $this->is_clean,
            'primary_current_r' => $this->primary_current_r,
            'primary_current_s' => $this->primary_current_s,
            'primary_current_t' => $this->primary_current_t,
            'primary_voltage_r' => $this->primary_voltage_r,
            'primary_voltage_s' => $this->primary_voltage_s,
            'primary_voltage_t' => $this->primary_voltage_t,
            'secondary_current_r' => $this->secondary_current_r,
            'secondary_current_s' => $this->secondary_current_s,
            'secondary_current_t' => $this->secondary_current_t,
            'secondary_voltage_r' => $this->secondary_voltage_r,
            'secondary_voltage_s' => $this->secondary_voltage_s,
            'secondary_voltage_t' => $this->secondary_voltage_t,
            'temperature_oil' => $this->temperature_oil,
            'temperature_winding' => $this->temperature_winding,
            'desicant_level_id' => $this->desicant_level_id,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
            'inspectedBy' => new UserResource($this->whenLoaded('inspectedBy')),
            'inspectionForm' => new EquipmentInspectionResource($this->whenLoaded('inspectionForm')),
        ];
    }
}
