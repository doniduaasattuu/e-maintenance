<?php

namespace App\Http\Requests\Finding\Abnormality;

use App\Models\FindingStatus;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAbnormalityRequest extends FormRequest
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
        $closedStatus = FindingStatus::where('name', 'Closed')->first();
        $closedId = $closedStatus?->id;
        $finding = $this->route('finding');

        return [
            'finding_clause_id'      => ['required', 'exists:finding_clauses,id'],
            'cause_code_id'          => ['required', 'exists:cause_codes,id'],
            'description'            => ['required', 'string', 'min:10'],
            'functional_location_id' => ['required', 'exists:functional_locations,id'],
            'department_id'          => ['required', 'exists:departments,id'],
            'equipment_id'           => ['nullable', 'exists:equipments,id'],
            'finding_status_id'      => ['required', 'exists:finding_statuses,id'],
            'finding_priority_id'    => ['required', 'exists:finding_priorities,id'],
            'images' => [
                'nullable',
                'array',
                'max:5',
                function ($attribute, $value, $fail) use ($closedId, $finding) {
                    if ($this->finding_status_id == $closedId) {
                        $existingPhotos = $finding ? $finding->images()->where('category', 'after')->count() : 0;
                        $newPhotos = is_array($value) ? count($value) : 0;

                        if (($existingPhotos + $newPhotos) === 0) {
                            $fail('The finding cannot be closed without at least one completion photo.');
                        }
                    }
                },
            ],
            'images.*'               => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ];
    }
}
