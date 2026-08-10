<?php

namespace App\Http\Resources;

use App\Traits\HasStandardDateResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ImprovementResource extends JsonResource
{
    use HasStandardDateResource;
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
            'title' => $this->title,

            'problem' => $this->problem,
            'description' => $this->description,
            'root_cause' => $this->root_cause,

            'expected_benefit' => $this->expected_benefit,
            'actual_benefit' => $this->actual_benefit,

            'implementation_date' => $this->implementation_date,

            'remarks' => $this->remarks,

            /*
             |--------------------------------------------------------------------------
             | Foreign Keys
             |--------------------------------------------------------------------------
             */

            'functional_location_id' => $this->functional_location_id,
            'equipment_id' => $this->equipment_id,
            'department_id' => $this->department_id,
            'improvement_category_id' => $this->improvement_category_id,
            'improvement_status_id' => $this->improvement_status_id,

            /*
             |--------------------------------------------------------------------------
             | Relationships
             |--------------------------------------------------------------------------
             */

            'functionalLocation' => new FunctionalLocationResource($this->whenLoaded('functionalLocation')),
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'category' => new ImprovementCategoryResource($this->whenLoaded('category')),
            'status' => new ImprovementStatusResource($this->whenLoaded('status')),
            'creator' => new UserResource($this->whenLoaded('creator')),
            'approver' => new UserResource($this->whenLoaded('approver')),

            'images' => ImprovementImageResource::collection($this->whenLoaded('images')),
            'gallery' => $this->when($this->relationLoaded('images'), function () {
                return [
                    'before' => ImprovementImageResource::collection($this->images->where('category', 'before')),
                    'after' => ImprovementImageResource::collection($this->images->where('category', 'after')),
                ];
            }),

            /*
             |--------------------------------------------------------------------------
             | Related Resources
             |--------------------------------------------------------------------------
             */

            // 'images' => ImprovementImageResource::collection(
            //     $this->whenLoaded('images')
            // ),

            // 'findings' => FindingResource::collection(
            //     $this->whenLoaded('findings')
            // ),

            // 'documents' => RepositoryResource::collection(
            //     $this->whenLoaded('documents')
            // ),

            /*
             |--------------------------------------------------------------------------
             | Timestamps
             |--------------------------------------------------------------------------
             */

            'created_at' => $this->formatDate($this->created_at),
            'updated_at' => $this->formatDate($this->updated_at),

            'can' => [
                'show' => $request->user()->can('view', $this->resource),
                'update' => $request->user()->can('update', $this->resource),
                'delete' => $request->user()->can('delete', $this->resource),
                'submit' => $request->user()->can('submit', $this->resource),
                'implement' => $request->user()->can('implement', $this->resource),
                'approve' => $request->user()->can('approve', $this->resource),
                'verify' => $request->user()->can('verify', $this->resource),
                'reject' => $request->user()->can('reject', $this->resource),
            ]
        ];
    }
}
