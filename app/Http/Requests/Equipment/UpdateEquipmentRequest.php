<?php

namespace App\Http\Requests\Equipment;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
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
            'code' => [
                'required',
                'string',
                'size:9',
                'regex:/^[A-Z]{3}\d{6}$/',
                Rule::unique('equipments', 'code')->ignore($this->equipment),
            ],
            'sort_field' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('equipments', 'sort_field')->ignore($this->equipment),
            ],
            'description' => ['required', 'string', 'max:255'],
            'functional_location_id' => ['nullable', 'required_if:equipment_status_id,1',  'prohibited_unless:equipment_status_id,1', 'exists:functional_locations,id'],
            'equipment_class_id' => ['required', 'exists:equipment_classes,id'],
            'equipment_status_id' => ['required', 'exists:equipment_statuses,id'],
        ];
    }


    public function messages()
    {
        return [
            'functional_location_id.required_if' => 'Functional location is required when the equipment status is "Installed".',
            'functional_location_id.prohibited_unless' => 'Functional location is only allowed when the equipment status is "Installed".',
        ];
    }
}
