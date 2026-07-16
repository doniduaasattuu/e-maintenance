<?php

namespace App\Http\Controllers;

use App\Http\Requests\Permission\StorePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Throwable;

class PermissionController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_permission');

        $perPage = $this->getPerPage($request);

        $query = $request->query('query');
        $permissions = Permission::where('name', 'LIKE', "%{$query}%")->paginate($perPage)->withQueryString();

        return Inertia::render('permission/index', [
            'permissions' => PermissionResource::collection($permissions),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_permission');

        return Inertia::render('permission/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePermissionRequest $request)
    {
        Gate::authorize('store_permission');

        try {
            $validated = $request->validated();

            Permission::create($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating permission',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Permission $permission)
    {
        Gate::authorize('show_permission');

        return Inertia::render('permission/show', [
            'permission' => new PermissionResource($permission),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Permission $permission)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Permission $permission)
    {
        Gate::authorize('delete_permission');

        try {
            $permission->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Permission deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed deleting permission',
            ]);
        }
    }
}
