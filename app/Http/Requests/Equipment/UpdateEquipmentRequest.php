<?php

namespace App\Http\Requests\Equipment;

use App\Models\EquipmentStatus;
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
        $tenant = config('app.tenant', 'FAJAR');
        $pattern = config("equipment.code_patterns.$tenant.regex");

        return [
            'code' => [
                'required',
                'string',
                "regex:$pattern",
                Rule::unique('equipments', 'code')->ignore($this->equipment),
            ],

            'sort_field' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('equipments', 'sort_field')->ignore($this->equipment),
            ],

            'description' => [
                'required',
                'string',
                'max:255',
            ],

            'functional_location_id' => [
                'nullable',
                'exists:functional_locations,id',
            ],

            'equipment_class_id' => [
                'required',
                'exists:equipment_classes,id',
            ],

            'equipment_status_id' => [
                'required',
                'exists:equipment_statuses,id',
            ],

            'equipment_type_id' => [
                'required',
                'exists:equipment_types,id',
            ],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {

            $status = EquipmentStatus::find($this->equipment_status_id);

            if (! $status) {
                return;
            }

            if ($status->isInstalled() && empty($this->functional_location_id)) {
                $validator->errors()->add(
                    'functional_location_id',
                    'Functional location is required when the equipment status is "Installed".'
                );
            }

            if (!$status->isInstalled() && ! empty($this->functional_location_id)) {
                $validator->errors()->add(
                    'functional_location_id',
                    'Functional location is only allowed when the equipment status is "Installed".'
                );
            }
        });
    }

    // public function messages()
    // {
    //     return [
    //         'functional_location_id.required_if' => 'Functional location is required when the equipment status is "Installed".',
    //         'functional_location_id.prohibited_unless' => 'Functional location is only allowed when the equipment status is "Installed".',
    //     ];
    // }
}
