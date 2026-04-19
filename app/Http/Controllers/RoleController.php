<?php

namespace App\Http\Controllers;

use App\Http\Requests\Role\StoreRoleRequest;
use App\Http\Requests\Role\UpdateRoleRequest;
use App\Http\Resources\RoleResource;
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
        Gate::authorize('index_role');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $query = $request->query('query');
        $roles = Role::where('name', 'LIKE', "%{$query}%")->paginate($perPage)->withQueryString();

        return Inertia::render('role/index', [
            'roles' => RoleResource::collection($roles),
            'filters' => $request->only(['query', 'per_page']),
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
        Gate::authorize('store_role');

        try {
            $validated = $request->validated();

            $newRole = new Role(['name' => $validated['name']]);
            $newRole->save();
            $newRole->syncPermissions($validated['selectedPermissions']);

            return back();
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
        Gate::authorize('show_role');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        Gate::authorize('edit_role');
        Gate::authorize('update', $role);

        return Inertia::render('role/edit', [
            'availablePermissions' => Permission::pluck('name'),
            'role' => new RoleResource($role),
            'currentPermissions' => $role->permissions->pluck('name')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        Gate::authorize('update_role');
        Gate::authorize('update', $role);

        try {
            $validated = $request->validated();

            $role->update([
                'name' => $validated['name'],
            ]);

            $role->syncPermissions($validated['selectedPermissions']);

            return back();
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
        Gate::authorize('delete', $role);

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
