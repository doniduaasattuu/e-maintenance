<?php

namespace App\Http\Requests\Department;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
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
                'max:50',
                'string',
                Rule::unique('departments', 'name')->ignore($this->department),
            ],
            'code' => [
                'required',
                'max:5',
                'string',
                'uppercase',
                Rule::unique('departments', 'code')->ignore($this->department),
            ],
            'division_id' => ['required', 'exists:divisions,id'],
        ];
    }
}
