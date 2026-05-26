<?php

namespace App\Http\Requests\Material;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialRequest extends FormRequest
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
            'code' => ['required', 'numeric', 'unique:materials,code'],
            'name' => ['required', 'string', 'max:200', 'unique:materials,name'],
            'price' => ['nullable', 'numeric'],
            'material_unit_id' => ['nullable', 'exists:material_units,id'],
            'material_type_id' => ['nullable', 'exists:material_types,id'],
        ];
    }
}
