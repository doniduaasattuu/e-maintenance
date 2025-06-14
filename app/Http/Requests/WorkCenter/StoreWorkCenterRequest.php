<?php

namespace App\Http\Requests\WorkCenter;

use Illuminate\Foundation\Http\FormRequest;

class StoreWorkCenterRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:50', 'unique:work_centers,name'],
            'code' => [
                'required',
                'string',
                'size:8',
                'regex:/^[A-Z]{3}\d{5}$/',
                'unique:work_centers,code',
            ],
        ];
    }
}
