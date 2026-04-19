<?php

namespace App\Http\Controllers;

use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\DivisionResource;
use App\Models\Department;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_department');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $departments = Department::with('division')->search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('department/index', [
            'departments' => DepartmentResource::collection($departments),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_department');

        $divisions = Division::all();

        return Inertia::render('department/create', [
            'divisions' => DivisionResource::collection($divisions),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDepartmentRequest $request)
    {
        Gate::authorize('store_department');

        $validated = $request->validated();

        Department::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
            'division_id' => $validated['division_id'],
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Department $department)
    {
        // Gate::authorize('show_department');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Department $department)
    {
        Gate::authorize('edit_department');

        $divisions = Division::all();

        return Inertia::render('department/edit', [
            'department' => new DepartmentResource($department),
            'divisions' => DivisionResource::collection($divisions),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDepartmentRequest $request, Department $department)
    {
        Gate::authorize('update_department');

        try {
            $validated = $request->validated();

            $department->update([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'division_id' => $validated['division_id'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating department',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Department $department)
    {
        Gate::authorize('delete_department');

        $department->delete();

        return redirect()->route('departments.index')->with('message', [
            'type' => 'success',
            'description' => 'Department deleted successfully',
        ]);
    }
}
