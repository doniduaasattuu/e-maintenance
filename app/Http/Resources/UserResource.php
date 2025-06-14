<?php

namespace App\Http\Resources;

use App\Models\Department;
use App\Models\Position;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'employee_id' => $this->employee_id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'avatar' => $this->avatar,
            'department_id' => $this->department_id,
            'position_id' => $this->position_id,
            'work_center_id' => $this->work_center_id,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'position' => new PositionResource($this->whenLoaded('position')),
            'work_center' => new WorkCenterResource($this->whenLoaded('workCenter')),
            'isOnline' => $this->isOnline(),
            'deleted_at' => $this->deleted_at?->toFormattedDateString(),
            'created_at' => $this->created_at?->toFormattedDateString(),
            'updated_at' => $this->updated_at?->toFormattedDateString(),
        ];
    }
}
