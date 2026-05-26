<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\DepartmentResource;
use App\Models\Department;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $departments = Department::all(['id', 'code', 'name']);

        return Inertia::render('auth/register', [
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'employee_id' => 'required|string|max_digits:8|unique:users,employee_id',
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'department_id' => 'required|numeric|exists:departments,id',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'registration_key' => ['required', Rule::in([config('services.registration_key')]),],
        ], [
            'registration_key.in'       => 'Your registration key is wrong.',
        ]);

        $user = User::create([
            'employee_id' => $request->employee_id,
            'name' => $request->name,
            'email' => $request->email,
            'department_id' => $request->department_id,
            'password' => Hash::make($request->password),
        ]);

        if (Role::where('name', 'Viewer')->exists()) {
            $user->assignRole("Viewer");
        }

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
