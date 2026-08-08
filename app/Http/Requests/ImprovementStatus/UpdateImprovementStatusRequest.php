<?php

namespace App\Http\Requests\ImprovementStatus;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateImprovementStatusRequest extends FormRequest
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
                'max:100',
                Rule::unique('improvement_statuses', 'name')
                    ->ignore($this->improvement_status),
            ],

            'color' => [
                'required',
                'string',
                'regex:/^#[0-9A-Fa-f]{6}$/',
            ],

            'sequence' => [
                'required',
                'integer',
                'min:1',
                'max:255',
                Rule::unique('improvement_statuses', 'sequence')
                    ->ignore($this->improvement_status),
            ],
        ];
    }
}
