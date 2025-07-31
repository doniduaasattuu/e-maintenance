<?php

namespace App\Http\Requests\InspectionTransformer;

use Illuminate\Foundation\Http\FormRequest;

class StoreInspectionTransformerRequest extends FormRequest
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
            'primary_current_r' => ['nullable', 'numeric', 'max:9999'],
            'primary_current_s' => ['nullable', 'numeric', 'max:9999'],
            'primary_current_t' => ['nullable', 'numeric', 'max:9999'],
            'primary_voltage_r' => ['nullable', 'numeric', 'max:99999'],
            'primary_voltage_s' => ['nullable', 'numeric', 'max:99999'],
            'primary_voltage_t' => ['nullable', 'numeric', 'max:99999'],
            'secondary_current_r' => ['nullable', 'numeric', 'max:9999'],
            'secondary_current_s' => ['nullable', 'numeric', 'max:9999'],
            'secondary_current_t' => ['nullable', 'numeric', 'max:9999'],
            'secondary_voltage_r' => ['nullable', 'numeric', 'max:99999'],
            'secondary_voltage_s' => ['nullable', 'numeric', 'max:99999'],
            'secondary_voltage_t' => ['nullable', 'numeric', 'max:99999'],
            'temperature_oil' => ['nullable', 'numeric', 'max:150'],
            'temperature_winding' => ['nullable', 'numeric', 'max:150'],
            'desicant_level_id' => ['nullable', 'exists:App\Models\QualityRating,id'],
            'inspected_by' => ['nullable', 'exists:App\Models\User,id'],
        ];
    }
}
