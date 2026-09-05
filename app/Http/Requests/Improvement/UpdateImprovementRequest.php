<?php

namespace App\Http\Requests\Improvement;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateImprovementRequest extends FormRequest
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
            'functional_location_id' => [
                'required',
                'integer',
                'exists:functional_locations,id',
            ],

            'equipment_id' => [
                'nullable',
                'integer',
                'exists:equipments,id',
            ],

            'department_id' => [
                'nullable',
                'integer',
                'exists:departments,id',
            ],

            'improvement_category_id' => [
                'required',
                'integer',
                'exists:improvement_categories,id',
            ],

            'title' => [
                'required',
                'string',
                'max:50',
                Rule::unique('improvements', 'title')
                    ->ignore($this->improvement),
            ],

            'problem' => [
                'required',
                'string',
            ],

            'description' => [
                'required',
                'string',
            ],

            'root_cause' => [
                'required',
                'string',
            ],

            'expected_benefit' => [
                'nullable',
                'string',
            ],

            'actual_benefit' => [
                'nullable',
                'string',
            ],

            'implementation_date' => [
                'nullable',
                'date',
            ],

            'remarks' => [
                'nullable',
                'string',
            ],

            /*
         * Images
         */
            'images_before' => [
                'nullable',
                'array',
                'max:5',
            ],

            'images_before.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'images_after' => [
                'nullable',
                'array',
                'max:5',
            ],

            'images_after.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ];
    }
}
