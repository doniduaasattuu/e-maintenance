<?php

namespace App\Http\Requests\EquipmentType;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentTypeRequest extends FormRequest
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
                'max:30',
                'uppercase',
                'alpha_dash',
                Rule::unique('equipment_types', 'code')->ignore($this->equipment_type),
            ],
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('equipment_types', 'name')->ignore($this->equipment_type),
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'equipment_class_id' => [
                'required',
                'exists:equipment_classes,id'
            ],
            'is_active' => [
                'required',
                'boolean',
            ],
        ];
    }
}
