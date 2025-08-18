<?php

namespace App\Http\Resources;

use App\Models\EquipmentInspectionForm;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class InspectionMotorResource extends JsonResource
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
            'number_of_greasing' => $this->number_of_greasing,
            'temperature_de' => (string) $this->temperature_de,
            'temperature_body' => (string) $this->temperature_body,
            'temperature_nde' => (string) $this->temperature_nde,
            'vibration_dev' => (string) $this->vibration_dev,
            'vibration_deh' => (string) $this->vibration_deh,
            'vibration_dea' => (string) $this->vibration_dea,
            'vibration_def' => (string) $this->vibration_def,
            'is_noisy_de' => $this->is_noisy_de,
            'vibration_ndev' => (string) $this->vibration_ndev,
            'vibration_ndeh' => (string) $this->vibration_ndeh,
            'vibration_ndef' => (string) $this->vibration_ndef,
            'is_noisy_nde' => $this->is_noisy_nde,
            'inspected_by' => $this->inspected_by,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
            'inspectedBy' => new UserResource($this->whenLoaded('inspectedBy')),
            'inspectionForm' => new EquipmentInspectionResource($this->whenLoaded('inspectionForm')),
        ];
    }
}
