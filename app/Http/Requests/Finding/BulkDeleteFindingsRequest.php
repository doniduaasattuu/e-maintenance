<?php

namespace App\Http\Requests\Finding;

use Illuminate\Foundation\Http\FormRequest;

class BulkDeleteFindingsRequest extends FormRequest
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
            'finding_ids'   => ['required', 'array', 'min:1'],
            'finding_ids.*' => ['integer', 'distinct', 'exists:findings,id'],
        ];
    }
}
