<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImprovementImageResource extends JsonResource
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
            'improvement_id' => $this->improvement_id,
            'file_path' => $this->file_path,
            'category' => $this->category,
            'url' => $this->url,
            'original_name' => $this->original_name,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),

            'improvement' => new ImprovementResource($this->whenLoaded('improvement')),
        ];
    }
}
