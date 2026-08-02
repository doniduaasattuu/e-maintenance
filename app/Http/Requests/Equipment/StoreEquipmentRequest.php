<?php

namespace App\Http\Requests\Equipment;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentRequest extends FormRequest
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
        $tenant = config('app.tenant', 'FAJAR');
        $pattern = config("equipment.code_patterns.$tenant.regex");

        return [
            'code' => ['required', 'string', 'unique:equipments,code', "regex:$pattern"],
            'sort_field' => ['nullable', 'string', 'max:50'],
            'description' => ['required', 'string', 'max:255'],
            'functional_location_id' => ['nullable', 'required_if:equipment_status_id,1',  'prohibited_unless:equipment_status_id,1', 'exists:functional_locations,id'],
            'equipment_class_id' => ['required', 'exists:equipment_classes,id'],
            'equipment_status_id' => ['required', 'exists:equipment_statuses,id'],
            'equipment_type_id' => ['required', 'exists:equipment_types,id'],
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
