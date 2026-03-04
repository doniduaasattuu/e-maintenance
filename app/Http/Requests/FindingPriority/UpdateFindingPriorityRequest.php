<?php

namespace App\Http\Requests\FindingPriority;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFindingPriorityRequest extends FormRequest
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
            'label' => [
                'required',
                'string',
                'max:50',
                Rule::unique('finding_priorities', 'label')->ignore($this->finding_priority),
            ],
            'sla_resolution_hours' => [
                'nullable',
                'numeric',
            ],
            'description' => ['required', 'string', 'max:255'],
            'color_code' => ['nullable', 'hex_color']
        ];
    }
}
