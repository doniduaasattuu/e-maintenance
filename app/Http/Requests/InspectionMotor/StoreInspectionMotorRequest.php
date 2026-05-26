<?php

namespace App\Http\Requests\InspectionMotor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInspectionMotorRequest extends FormRequest
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
            'number_of_greasing' => ['nullable', 'numeric'],
            'temperature_de' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:150'],
            'temperature_body' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:150'],
            'temperature_nde' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:150'],
            'vibration_dev' => ['nullable', 'numeric', 'max:45'],
            'vibration_deh' => ['nullable', 'numeric', 'max:45'],
            'vibration_dea' => ['nullable', 'numeric', 'max:45'],
            'vibration_def' => ['nullable', 'numeric', 'max:45'],
            'is_noisy_de' => ['nullable', 'boolean'],
            'vibration_ndev' => ['nullable', 'numeric', 'max:45'],
            'vibration_ndeh' => ['nullable', 'numeric', 'max:45'],
            'vibration_ndef' => ['nullable', 'numeric', 'max:45'],
            'is_noisy_nde' => ['nullable', 'boolean'],
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
}
