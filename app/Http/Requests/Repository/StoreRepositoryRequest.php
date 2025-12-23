<?php

namespace App\Http\Requests\Repository;

use Illuminate\Foundation\Http\FormRequest;

class StoreRepositoryRequest extends FormRequest
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
        $this->merge([
            'uploaded_by' => $this->user()->id,
        ]);

        return [
            'title' => ['required', 'string'],
            'file' => ['required', 'file', 'max:10240'],
            'uploaded_by' => ['nullable', 'exists:users,id'],
        ];
    }
}
