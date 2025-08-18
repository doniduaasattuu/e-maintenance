<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
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
            'code' => $this->code,
            'sort_field' => $this->sort_field,
            'description' => $this->description,
            'functional_location_id' => $this->functional_location_id,
            'equipment_class_id' => $this->equipment_class_id,
            'equipment_status_id' => $this->equipment_status_id,
            'functionalLocation' => new FunctionalLocationResource($this->whenLoaded('functionalLocation')),
            'equipmentClass' => new EquipmentClassResource($this->whenLoaded('equipmentClass')),
            'equipmentStatus' => new EquipmentStatusResource($this->whenLoaded('equipmentStatus')),
            'installDismantleHistories' => new InstallDismantleHistoryResource($this->whenLoaded('installDismantleHistories')),
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
