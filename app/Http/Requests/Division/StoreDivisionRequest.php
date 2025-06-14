<?php

namespace App\Http\Requests\Division;

use Illuminate\Foundation\Http\FormRequest;

class StoreDivisionRequest extends FormRequest
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
            'name' => ['required', 'max:50', 'string', 'unique:divisions,name'],
            'code' => ['required', 'max:5', 'string', 'uppercase', 'unique:divisions,code'],
        ];
    }
}
