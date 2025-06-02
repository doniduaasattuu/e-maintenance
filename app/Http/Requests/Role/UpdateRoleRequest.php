<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;

class UpdateRoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasRole('Admin');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $validPermissions = Permission::pluck('name');

        return [
            'name' => [
                'required',
                'string',
                'max:15',
                Rule::unique('roles', 'name')->ignore($this->role),
            ],
            'selectedPermissions' => ['required', 'array'],
            'selectedPermissions.*' => ['string', Rule::in($validPermissions)],
        ];
    }

    public function messages()
    {
        return [
            'selectedPermissions.required' => 'At least one permission must be selected.'
        ];
    }
}
