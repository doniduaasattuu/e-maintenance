<?php

namespace App\Http\Requests\Material;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMaterialRequest extends FormRequest
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
                'numeric',
                'digits:8',
                Rule::unique('materials', 'code')->ignore($this->material),
            ],
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('materials', 'name')->ignore($this->material),
            ],
            'price' => ['nullable', 'numeric'],
            'unit_id' => ['nullable', 'exists:units,id'],
            'material_type_id' => ['nullable', 'exists:material_types,id'],
        ];
    }
}
