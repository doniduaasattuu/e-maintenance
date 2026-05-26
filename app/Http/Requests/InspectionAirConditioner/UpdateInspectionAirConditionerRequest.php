<?php

namespace App\Http\Requests\InspectionAirConditioner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInspectionAirConditionerRequest extends FormRequest
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
            'is_drain_leaking' => ['nullable', 'boolean'],
            'current_load' => ['nullable', 'numeric', 'max:150'],
            'blowing_temperature' => ['required_if:is_operational,1', 'nullable', 'numeric', 'max:40'],
            'ambient_temperature' => ['required_if:is_operational,1', 'numeric', 'max:50'],
            'is_filter_clean' => ['nullable', 'boolean'],
            'is_evaporator_clean' => ['nullable', 'boolean'],
            'is_condensor_clean' => ['nullable', 'boolean'],
        ];
    }

    public function messages()
    {
        return [
            'blowing_temperature' => 'The blowing temperature field is required when equipment is operational.',
            'ambient_temperature' => 'The ambient temperature field is required when equipment is operational.',
        ];
    }
}
