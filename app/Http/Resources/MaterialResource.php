<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
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
            'name' => $this->name,
            'price' => $this->price,
            'material_unit_id' => $this->material_unit_id,
            'material_type_id' => $this->material_type_id,
            'unit' => new MaterialUnitResource($this->whenLoaded('unit')),
            'type' => new MaterialTypeResource($this->whenLoaded('type')),
            'images' => ImageResource::collection($this->whenLoaded('images')),
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
