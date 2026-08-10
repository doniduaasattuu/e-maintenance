<?php

namespace App\Http\Requests\Improvement;

use Illuminate\Foundation\Http\FormRequest;

class StoreImprovementRequest extends FormRequest
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

            'images_before' => [
                'required',
                'array',
                'min:1',
                'max:5',
            ],

            'images_before.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],

            'images_after' => [
                'required',
                'array',
                'min:1',
                'max:5',
            ],

            'images_after.*' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048'
            ],
        ];
    }
}
