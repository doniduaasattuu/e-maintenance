<?php

namespace App\Http\Requests\InspectionAirConditioner;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInspectionAirConditionerRequest extends FormRequest
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
            'equipment_id' => ['nullable', 'exists:App\Models\Equipment,id'],
            'is_operational' => ['required', 'boolean'],
            'is_drain_leaking' => ['required', 'boolean'],
            'current_load' => ['nullable', 'numeric', 'max:150'],
            'blowing_temperature' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:40'],
            'ambient_temperature' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:50'],
            'is_filter_clean' => ['required', 'boolean'],
            'is_evaporator_clean' => ['required', 'boolean'],
            'is_condensor_clean' => ['required', 'boolean'],

            // Field Kontrol
            'has_abnormality' => ['required', 'boolean'],

            // Data Abnormality (Hanya wajib jika has_abnormality = true)
            'finding_clause_id'    => ['required_if:has_abnormality,true', 'nullable', 'exists:finding_clauses,id'],
            'finding_status_id'   => ['required_if:has_abnormality,true', 'nullable', 'exists:finding_statuses,id'],
            'finding_priority_id' => ['required_if:has_abnormality,true', 'nullable', 'exists:finding_priorities,id'],
            'cause_code_id'       => ['required_if:has_abnormality,true', 'nullable', 'exists:cause_codes,id'],
            'department_id'       => ['required_if:has_abnormality,true', 'nullable', 'exists:departments,id'],
            'work_center_id'      => ['required_if:has_abnormality,true', 'nullable', 'exists:work_centers,id'],
            'description'         => ['required_if:has_abnormality,true', 'nullable', 'string', 'min:10'],

            // Images
            'images' => [
                Rule::requiredIf(filter_var($this->has_abnormality, FILTER_VALIDATE_BOOLEAN)),
                'nullable',
                'array',
                'min:1',
                'max:5'
            ],
            'images.*'            => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages()
    {
        return [
            'blowing_temperature' => 'The blowing temperature field is required when equipment is operational.',
            'ambient_temperature' => 'The ambient temperature field is required when equipment is operational.',
        ];
    }
}
