<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Throwable;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_role');

        $query = $request->query('query');
        $roles = Role::where('name', 'LIKE', "%{$query}%")->paginate()->withQueryString();

        return Inertia::render('role/index', [
            'roles' => RoleResource::collection($roles),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_role');

        return Inertia::render('role/create', [
            'availablePermissions' => Permission::pluck('name')
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        Gate::authorize('create_role');
        $validated = $request->validated();

        try {
            $newRole = new Role(['name' => $validated['name']]);
            $newPermissions = collect($validated['selectedPermissions'])->map(function ($permission) {
                return Permission::where('name', $permission)->first()->id;
            });
            $newRole->save();
            $newRole->permissions()->sync($newPermissions);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Role created successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating role',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        Gate::authorize('read_role');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        Gate::authorize('update_role');

        if ($role->name === 'Admin') {
            abort(403, 'You are not allowed to edit the Admin role.');
        }

        return Inertia::render('role/edit', [
            'availablePermissions' => Permission::pluck('name'),
            'id' => $role->id,
            'name' => $role->name,
            'currentPermissions' => $role->permissions->pluck('name')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        Gate::authorize('update_role');

        try {
            $validated = $request->validated();

            $role->name = $validated['name'];
            $role->save();

            $selectedPermissions = collect($validated['selectedPermissions'])->map(function ($permission) {
                return Permission::where('name', $permission)->first()->id;
            });
            $role->permissions()->sync($selectedPermissions);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Role updated successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating role',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        Gate::authorize('delete_role');

        if ($role->name === 'Admin') {
            abort(403, 'You are not allowed to delete the Admin role.');
        }

        try {
            $role->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Role deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Role is not found',
            ]);
        }
    }
}
