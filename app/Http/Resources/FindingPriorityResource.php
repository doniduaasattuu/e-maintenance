<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FindingPriorityResource extends JsonResource
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
            'label' => $this->label,
            'sla_resolution_hours' => $this->sla_resolution_hours,
            'description' => $this->description,
            'color_code' => $this->color_code,
            'minimum_point' => $this->minimum_point,
            'maximum_point' => $this->maximum_point,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
