<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstallDismantleHistoryResource extends JsonResource
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
            'from_sort_field' => $this->from_sort_field,
            'to_sort_field' => $this->to_sort_field,
            'from_functional_location_id' => $this->from_functional_location_id,
            'to_functional_location_id' => $this->to_functional_location_id,
            'changed_by' => $this->changed_by,
            'changed_at' => $this->changed_at,
            'note' => $this->note,

            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'fromStatus' => new EquipmentStatusResource($this->whenLoaded('fromStatus')),
            'toStatus' => new EquipmentStatusResource($this->whenLoaded('toStatus')),
            'fromFunctionalLocation' => new FunctionalLocationResource($this->whenLoaded('fromFunctionalLocation')),
            'toFunctionalLocation' => new FunctionalLocationResource($this->whenLoaded('toFunctionalLocation')),
            'changedBy' => new UserResource($this->whenLoaded('changedBy')),

            'changed_at' => $this->changed_at?->toFormattedDateString(),
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
