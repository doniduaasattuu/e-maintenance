<?php

namespace App\Http\Requests\Finding;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFindingRequest extends FormRequest
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
            'finding_status_id'   => 'sometimes|required|exists:finding_statuses,id',
            'finding_priority_id' => 'sometimes|required|exists:finding_priorities,id',
            'description'         => 'sometimes|required|string|min:10',
            'notification'        => 'nullable|string|max:25',
            'verified_by'         => 'required_if:status_name,Closed|exists:users,id',
            'closed_at'           => 'required_if:status_name,Closed|date',
        ];
    }
}
