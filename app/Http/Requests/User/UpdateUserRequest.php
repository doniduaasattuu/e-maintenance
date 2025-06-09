<?php

namespace App\Http\Requests\User;

use App\Models\Department;
use App\Models\Position;
use App\Models\WorkCenter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo('update_user');
    }

    public function prepareForValidation()
    {
        $this->mergeIfMissing([
            'selectedRoles' => [],
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user');

        $validRoles = Role::pluck('name');
        $validDepartments = Department::pluck('id');
        $validPositions = Position::pluck('id');
        $validWorkCenters = WorkCenter::pluck('id');

        return [
            'name' => ['required', 'string', 'max:25', Rule::unique('users', 'name')->ignore($userId)],
            'employee_id' => ['required', 'string', 'digits:8', Rule::unique('users', 'employee_id')->ignore($userId)],
            'email' => ['required', 'string', 'email', Rule::unique('users', 'email')->ignore($userId)],
            'phone_number' => ['nullable', 'string', Rule::unique('users', 'phone_number')->ignore($userId)],
            'department_id' => ['nullable', Rule::in($validDepartments)],
            'position_id' => ['nullable', Rule::in($validPositions)],
            'work_center_id' => ['nullable', Rule::in($validWorkCenters)],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'selectedRoles' => ['nullable', 'array'],
            'selectedRoles.*' => ['string', Rule::in($validRoles)],
        ];
    }
}
