<?php

namespace App\Http\Requests\User;

use App\Models\Department;
use App\Models\Position;
use App\Models\WorkCenter;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->hasPermissionTo('create_user');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $this->merge([
            'password' => Hash::make('password')
        ]);

        $this->mergeIfMissing([
            'selectedRoles' => [],
        ]);

        $validRoles = Role::pluck('name');
        $validDepartments = Department::pluck('id');
        $validPositions = Position::pluck('id');
        $validWorkCenters = WorkCenter::pluck('id');

        return [
            'name' => ['required', 'string', 'max:25', 'unique:users,name'],
            'employee_id' => ['required', 'numeric', 'max_digits:8', 'unique:users,employee_id'],
            'email' => ['required', 'string', 'email', 'unique:users,email'],
            'phone_number' => ['nullable', 'string', 'unique:users,phone_number'],
            'password' => ['required'],
            'department_id' => ['nullable', Rule::in($validDepartments)],
            'position_id' => ['nullable', Rule::in($validPositions)],
            'work_center_id' => ['nullable', Rule::in($validWorkCenters)],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'selectedRoles' => ['nullable', 'array'],
            'selectedRoles.*' => ['string', Rule::in($validRoles)],
        ];
    }
}
