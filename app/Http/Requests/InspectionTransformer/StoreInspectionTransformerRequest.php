<?php

namespace App\Http\Requests\InspectionTransformer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInspectionTransformerRequest extends FormRequest
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
            'is_operational' => ['nullable', 'boolean'],
            'is_clean' => ['nullable', 'boolean'],
            'primary_current_r' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'primary_current_s' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'primary_current_t' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'primary_voltage_r' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'primary_voltage_s' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'primary_voltage_t' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'secondary_current_r' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'secondary_current_s' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'secondary_current_t' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:9999'],
            'secondary_voltage_r' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'secondary_voltage_s' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'secondary_voltage_t' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:99999'],
            'temperature_oil' => ['required', 'numeric', 'max:150'],
            'temperature_winding' => ['required', 'numeric', 'max:150'],
            'desicant_level_id' => ['required', 'exists:App\Models\QualityRating,id'],
            'inspected_by' => ['nullable', 'exists:App\Models\User,id'],

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
            'primary_current_r.required_if' => 'The primary current R field is required when equipment is operational.',
            'primary_current_s.required_if' => 'The primary current S field is required when equipment is operational.',
            'primary_current_t.required_if' => 'The primary current T field is required when equipment is operational.',
            'primary_voltage_r.required_if' => 'The primary voltage R field is required when equipment is operational.',
            'primary_voltage_s.required_if' => 'The primary voltage S field is required when equipment is operational.',
            'primary_voltage_t.required_if' => 'The primary voltage T field is required when equipment is operational.',
            'secondary_current_r.required_if' => 'The primary current R field is required when equipment is operational.',
            'secondary_current_s.required_if' => 'The primary current S field is required when equipment is operational.',
            'secondary_current_t.required_if' => 'The primary current T field is required when equipment is operational.',
            'secondary_voltage_r.required_if' => 'The primary voltage R field is required when equipment is operational.',
            'secondary_voltage_s.required_if' => 'The primary voltage S field is required when equipment is operational.',
            'secondary_voltage_t.required_if' => 'The primary voltage T field is required when equipment is operational.',
        ];
    }
}
