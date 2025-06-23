<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallDismantleResource extends JsonResource
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
            'equipment_id' => $this->equipment_id,
            'from_status_id' => $this->from_status_id,
            'to_status_id' => $this->to_status_id,
            'functional_location_id' => $this->functional_location_id,
            'changed_by' => $this->changed_by,
            'changed_at' => $this->changed_at,
            'note' => $this->note,

            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'fromStatus' => new EquipmentStatusResource($this->whenLoaded('fromStatus')),
            'toStatus' => new EquipmentStatusResource($this->whenLoaded('toStatus')),
            'functionalLocation' => new FunctionalLocationResource($this->whenLoaded('functionalLocation')),
            'changedBy' => new UserResource($this->whenLoaded('changedBy')),

            'changed_at' => $this->changed_at?->toFormattedDateString(),
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
