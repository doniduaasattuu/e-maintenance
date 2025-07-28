<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InspectionPanelResource extends JsonResource
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
            'temperature_incoming_r' => (string) $this->temperature_incoming_r,
            'temperature_incoming_s' => (string) $this->temperature_incoming_s,
            'temperature_incoming_t' => (string) $this->temperature_incoming_t,
            'temperature_cabinet' => (string) $this->temperature_cabinet,
            'temperature_outgoing_r' => (string) $this->temperature_outgoing_r,
            'temperature_outgoing_s' => (string) $this->temperature_outgoing_s,
            'temperature_outgoing_t' => (string) $this->temperature_outgoing_t,
            'current_r' => (string) $this->current_r,
            'current_s' => (string) $this->current_s,
            'current_t' => (string) $this->current_t,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
            'inspectedBy' => new UserResource($this->whenLoaded('inspectedBy')),
            'inspectionForm' => new EquipmentInspectionResource($this->whenLoaded('inspectionForm')),
        ];
    }
}
