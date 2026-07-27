<?php

namespace App\Http\Requests\Plant;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlantRequest extends FormRequest
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
                Rule::unique('plants', 'code')->ignore($this->plant)
            ],
            'name' => [
                'required',
                'string',
                Rule::unique('plants', 'name')->ignore($this->plant)
            ],
            'sort_order' => [
                'nullable',
                'numeric',
                Rule::unique('plants', 'sort_order')->ignore($this->plant)
            ],
        ];
    }
}
