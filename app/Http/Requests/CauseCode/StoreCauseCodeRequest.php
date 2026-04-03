<?php

namespace App\Http\Requests\CauseCode;

use Illuminate\Foundation\Http\FormRequest;

class StoreCauseCodeRequest extends FormRequest
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
                'max:25',
                'string',
                'unique:cause_codes,code',
            ],
            'description' => [
                'required',
                'max:255',
                'string'
            ],
        ];
    }
}
