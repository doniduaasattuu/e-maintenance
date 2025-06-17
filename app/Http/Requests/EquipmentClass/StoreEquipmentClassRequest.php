<?php

namespace App\Http\Requests\EquipmentClass;

use Illuminate\Foundation\Http\FormRequest;

class StoreEquipmentClassRequest extends FormRequest
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
                'unique:equipment_classes,code',
            ],
            'name' => [
                'required',
                'string',
                'uppercase',
                'max:50',
                'unique:equipment_classes,name'
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
