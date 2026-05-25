<?php

namespace App\Http\Requests\Finding\Abnormality;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAbnormalityRequest extends FormRequest
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
            'cause_code_id'             => ['required', 'exists:cause_codes,id'],
            'description'               => ['required', 'string', 'min:10'],
            'functional_location_id'    => ['required', 'exists:functional_locations,id'],
            'department_id'             => ['required', 'exists:departments,id'],
            'work_center_id'            => [
                'required',
                Rule::exists('work_centers', 'id')->where(function ($query) {
                    $query->where('department_id', $this->input('department_id'));
                }),
            ],
            'equipment_id'              => ['nullable', 'exists:equipments,id'],
            'finding_status_id'         => ['required', 'exists:finding_statuses,id'],
            'finding_priority_id'       => ['required', 'exists:finding_priorities,id'],
            'images'                    => ['required', 'array', 'min:1', 'max:5'],
            'images.*'                  =>
            [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'work_center_id.exists' => 'The selected work center is not registered with the department.',
        ];
    }
}
