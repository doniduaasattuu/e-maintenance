<?php

namespace App\Http\Requests\MaterialType;

use Illuminate\Foundation\Http\FormRequest;

class StoreMaterialTypeRequest extends FormRequest
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
            'code' => ['required', 'uppercase', 'unique:material_types,code'],
            'description' => ['required']
        ];
    }
}
