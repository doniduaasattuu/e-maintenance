<?php

namespace App\Http\Requests\Finding\Audit;

use Illuminate\Foundation\Http\FormRequest;

class StoreAuditRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'finding_clause_id'         => ['required', 'exists:finding_clauses,id'],
            'description'               => ['required', 'string', 'min:10'],
            'functional_location_id'    => ['required', 'exists:functional_locations,id'],
            'department_id'             => ['nullable', 'exists:departments,id'],
            'work_center_id'            => ['nullable', 'exists:work_centers,id'],
            'finding_status_id'         => ['required', 'exists:finding_statuses,id'],
            'finding_priority_id'       => ['required', 'exists:finding_priorities,id'],
            'images'                    => ['required', 'array', 'min:1', 'max:5'],
            'images.*'                  => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ];
    }
}
