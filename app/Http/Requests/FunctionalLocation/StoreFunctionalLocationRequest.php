<?php

namespace App\Http\Requests\FunctionalLocation;

use Illuminate\Foundation\Http\FormRequest;

class StoreFunctionalLocationRequest extends FormRequest
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
            'code' => ['required', 'uppercase', 'regex:/^([A-Z0-9]+-)*[A-Z0-9]+$/', 'unique:functional_locations,code'],
            'description' => ['required']
        ];
    }
}
