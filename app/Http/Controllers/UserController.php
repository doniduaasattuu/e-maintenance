<?php

namespace App\Http\Controllers;

use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\PositionResource;
use App\Http\Resources\UserResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\Department;
use App\Models\Position;
use App\Models\User;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_user');

        $users = User::with(['department', 'position', 'workCenter'])->search($request)->paginate(10)->withQueryString();
        $departments = Department::all();
        $positions = Position::all();
        $workCenters = WorkCenter::all();

        return Inertia::render('user/index', [
            'users' => UserResource::collection($users),
            'departments' => DepartmentResource::collection($departments),
            'positions' => PositionResource::collection($positions),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'roles' => Role::pluck('name'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_user');

        $departments = Department::all();
        $positions = Position::all();
        $workCenters = WorkCenter::all();

        return Inertia::render('user/create', [
            'departments' => DepartmentResource::collection($departments),
            'positions' => PositionResource::collection($positions),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'availableRoles' => Role::pluck('name'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        Gate::authorize('store_user');

        $validated = $request->validated();

        $user = User::create($validated);

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = "/storage/" . $avatarPath;
        }

        if ($validated['selectedRoles']) {
            $user->assignRole($validated['selectedRoles']);
        }

        $user->save();

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Gate::authorize('show_user');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        Gate::authorize('edit_user');

        $departments = Department::all();
        $positions = Position::all();
        $workCenters = WorkCenter::all();

        return Inertia::render('user/edit', [
            'user' => new UserResource($user),
            'departments' => DepartmentResource::collection($departments),
            'positions' => PositionResource::collection($positions),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'availableRoles' => Role::pluck('name'),
            'userRoles' => collect($user->roles)->pluck('name')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update_user');

        $validated = $request->validated();

        $user->update([
            'name' => $validated['name'],
            'employee_id' => $validated['employee_id'],
            'email' => $validated['email'],
            'phone_number' => $validated['phone_number'],
            'department_id' => $validated['department_id'],
            'position_id' => $validated['position_id'],
            'work_center_id' => $validated['work_center_id'],
        ]);

        if ($request->hasFile('avatar')) {

            if ($user->avatar) {
                $oldAvatarPath = str_replace('/storage/', '', $user->avatar);

                if (Storage::disk('public')->exists($oldAvatarPath)) {
                    Storage::disk('public')->delete($oldAvatarPath);
                }
            }

            $avatarPath = $request->file(('avatar'))->store('avatars', 'public');
            $user->avatar = "/storage/" . $avatarPath;
        }

        if ($request->filled('selectedRoles')) {
            $user->syncRoles($validated['selectedRoles']);
        }

        $user->save();

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        Gate::authorize('delete_user');

        $user->delete();

        return back()->with('message', [
            'type' => 'success',
            'description' => 'User deleted successfully',
            'action' => [
                'label' => 'Undo',
                'url' => route('users.restore', $user->id),
                'method' => 'post',
            ]
        ]);
    }

    public function restore($id)
    {
        Gate::authorize('restore_user');

        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return back()->with('message', [
            'type' => 'success',
            'description' => 'User restored successfully',
        ]);
    }
}
