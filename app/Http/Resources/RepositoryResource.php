<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RepositoryResource extends JsonResource
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
            'title' => $this->title,
            'path' => $this->path,
            'extension' => $this->extension,
            'mime_type' => $this->mime_type,
            'url' => asset('storage/' . $this->path),
            'uploaded_by' => $this->uploaded_by,
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
            'uploadedBy' => new UserResource($this->whenLoaded('uploadedBy')),
        ];
    }
}
