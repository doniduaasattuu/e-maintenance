<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FindingResource extends JsonResource
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
            'description' => $this->description,
            'notification' => $this->notification,

            'clause' => new FindingClauseResource($this->whenLoaded('findingClause')),
            'status' => new FindingStatusResource($this->whenLoaded('findingStatus')),
            'priority' => new FindingPriorityResource($this->whenLoaded('findingPriority')),
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'functionalLocation' => new FunctionalLocationResource($this->whenLoaded('functionalLocation')),

            'inspector' => new UserResource($this->whenLoaded('inspectedBy')),
            'verifier' => new UserResource($this->whenLoaded('verifiedBy')),

            'images' => FindingImageResource::collection($this->whenLoaded('images')),

            'gallery' => $this->when($this->relationLoaded('images'), function () {
                return [
                    'before' => FindingImageResource::collection($this->images->where('category', 'before')),
                    'after' => FindingImageResource::collection($this->images->where('category', 'after')),
                ];
            }),

            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'closed_at' => $this->closed_at?->toDateTimeString(),
        ];
    }
}
