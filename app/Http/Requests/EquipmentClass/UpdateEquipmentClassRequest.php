<?php

namespace App\Http\Requests\EquipmentClass;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentClassRequest extends FormRequest
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
                'max:11',
                'uppercase',
                Rule::unique('equipment_classes', 'code')->ignore($this->equipment_class),
            ],
            'name' => [
                'required',
                'string',
                'uppercase',
                'max:50',
                Rule::unique('equipment_classes', 'name')->ignore($this->equipment_class),
            ],
            'formable_type' => [
                'required',
                'string',
                'uppercase',
                'max:50',
                'regex:/^\S*$/',
                Rule::unique('equipment_classes', 'formable')->ignore($this->equipment_class),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }

    public function messages()
    {
        return [
            'formable.regex' => 'The formable field cannot contain spaces',
        ];
    }
}
