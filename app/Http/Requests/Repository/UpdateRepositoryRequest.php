<?php

namespace App\Http\Requests\Repository;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRepositoryRequest extends FormRequest
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
            'title' => ['required', 'string', Rule::unique('repositories', 'title')->ignore($this->repository)],
            'file' => ['nullable', 'file', 'max:' . config('app.maximum_file_upload')],
            'uploaded_by' => ['nullable', 'exists:users,id'],
        ];
    }
}
