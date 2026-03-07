<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

class FindingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        Carbon::setLocale('id');

        // 1. Ambil SLA hours dari relasi priority (pastikan sudah di-load)
        $slaHours = $this->priority?->sla_resolution_hours;
        // 2. Kalkulasi Due Date: created_at + sla_hours
        $dueDate = ($slaHours && $this->created_at) ? Carbon::parse($this->created_at)->addHours($slaHours) : null;

        return [
            'id' => $this->id,
            'description' => $this->description,
            'notification' => $this->notification,

            'clause' => new FindingClauseResource($this->whenLoaded('clause')),
            'status' => new FindingStatusResource($this->whenLoaded('status')),
            'priority' => new FindingPriorityResource($this->whenLoaded('priority')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'functionalLocation' => new FunctionalLocationResource($this->whenLoaded('functionalLocation')),

            'inspector' => new UserResource($this->whenLoaded('inspector')),
            'verifier' => new UserResource($this->whenLoaded('verifier')),

            'images' => FindingImageResource::collection($this->whenLoaded('images')),

            'gallery' => $this->when($this->relationLoaded('images'), function () {
                return [
                    'before' => FindingImageResource::collection($this->images->where('category', 'before')),
                    'after' => FindingImageResource::collection($this->images->where('category', 'after')),
                ];
            }),

            'due_date' => $dueDate ? $dueDate->format('d/m/Y') : null,
            'due_date_readable' => $dueDate ? $dueDate->diffForHumans() : '-',
            'is_overdue' => $dueDate ? $dueDate->isPast() : false,

            'created_at' => $this->created_at ? Carbon::parse($this->created_at)->format('d/m/Y') : $this->created_at,
            'updated_at' => $this->updated_at?->toDateTimeString(),
            'closed_at' => Carbon::parse($this->closed_at)->format('d/m/Y'),
        ];
    }
}
