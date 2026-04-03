<?php

namespace App\Http\Requests\FindingType;

use Illuminate\Foundation\Http\FormRequest;

class StoreFindingTypeRequest extends FormRequest
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
                'max:25',
                'unique:finding_types,code'
            ],
            'name' => [
                'required',
                'string',
                'max:50',
                'unique:finding_types,name'
            ],
            'description' => ['required', 'string', 'max:255'],
        ];
    }
}
