<?php

namespace App\Http\Requests\ImprovementCategory;

use Illuminate\Foundation\Http\FormRequest;

class StoreImprovementCategoryRequest extends FormRequest
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
            'name' => [
                'required',
                'string',
                'max:25',
                'unique:improvement_categories,name'
            ],
            'description' => ['required', 'string'],
        ];
    }
}
