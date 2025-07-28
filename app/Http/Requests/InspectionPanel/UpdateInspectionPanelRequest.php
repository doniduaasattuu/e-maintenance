<?php

namespace App\Http\Requests\InspectionPanel;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInspectionPanelRequest extends FormRequest
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
            'temperature_incoming_r' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_incoming_s' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_incoming_t' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_cabinet' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_outgoing_r' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_outgoing_s' =>  ['nullable', 'numeric', 'max:150'],
            'temperature_outgoing_t' =>  ['nullable', 'numeric', 'max:150'],
            'current_r' =>  ['nullable', 'numeric', 'max:9999,99'],
            'current_s' =>  ['nullable', 'numeric', 'max:9999,99'],
            'current_t' =>  ['nullable', 'numeric', 'max:9999,99'],
            'inspected_by' => ['nullable', 'exists:App\Models\User,id'],
        ];
    }
}
