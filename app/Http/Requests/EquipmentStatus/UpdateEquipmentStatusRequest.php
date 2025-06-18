<?php

namespace App\Http\Requests\EquipmentStatus;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentStatusRequest extends FormRequest
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
                'max:11',
                'uppercase',
                Rule::unique('equipment_statuses', 'code')->ignore($this->equipment_status),
            ],
            'name' => [
                'required',
                'string',
                'uppercase',
                'max:50',
                Rule::unique('equipment_statuses', 'name')->ignore($this->equipment_status),
            ],
            'description' => ['nullable', 'string', 'max:255'],
        ];
    }
}
