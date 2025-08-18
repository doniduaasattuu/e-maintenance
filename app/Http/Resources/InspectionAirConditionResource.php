<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InspectionAirConditionResource extends JsonResource
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
            'is_drain_leaking' => $this->is_drain_leaking,
            'current_load' => $this->current_load,
            'blowing_temperature' => $this->blowing_temperature,
            'ambient_temperature' => $this->ambient_temperature,
            'is_filter_clean' => $this->is_filter_clean,
            'is_evaporator_clean' => $this->is_evaporator_clean,
            'is_condensor_clean' => $this->is_condensor_clean,
            'inspected_by' => $this->inspected_by,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
            'inspectedBy' => new UserResource($this->whenLoaded('inspectedBy')),
            'inspectionForm' => new EquipmentInspectionResource($this->whenLoaded('inspectionForm')),
        ];
    }
}
