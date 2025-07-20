<?php

namespace App\Http\Requests\InspectionMotor;

use Illuminate\Foundation\Http\FormRequest;

class StoreInspectionMotorRequest extends FormRequest
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
            'equipment_id' => ['nullable', 'exists:App\Models\Equipment,id'],
            'is_operational' => ['nullable', 'boolean'],
            'is_clean' => ['nullable', 'boolean'],
            'number_of_greasing' => ['nullable', 'numeric'],
            'temperature_de' => ['nullable', 'numeric', 'max:150'],
            'temperature_body' => ['nullable', 'numeric', 'max:150'],
            'temperature_nde' => ['nullable', 'numeric', 'max:150'],
            'vibration_dev' => ['nullable', 'numeric', 'max:45'],
            'vibration_deh' => ['nullable', 'numeric', 'max:45'],
            'vibration_dea' => ['nullable', 'numeric', 'max:45'],
            'vibration_def' => ['nullable', 'numeric', 'max:45'],
            'is_noisy_de' => ['nullable', 'boolean'],
            'vibration_ndev' => ['nullable', 'numeric', 'max:45'],
            'vibration_ndeh' => ['nullable', 'numeric', 'max:45'],
            'vibration_ndef' => ['nullable', 'numeric', 'max:45'],
            'is_noisy_nde' => ['nullable', 'boolean'],
            'inspected_by' => ['nullable', 'exists:App\Models\User,id'],
        ];
    }
}
