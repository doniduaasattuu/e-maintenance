<?php

namespace App\Http\Controllers;

use App\Exports\DepartmentExport;
use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\DivisionResource;
use App\Models\Department;
use App\Models\Division;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DepartmentController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_department');

        $perPage = $this->getPerPage($request);

        $departments = Department::with('division')->search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('department/index', [
            'departments' => DepartmentResource::collection($departments),
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

    public function export(Request $request)
    {
        return Excel::download(new DepartmentExport(), 'Departments_' . now()->format('Ymd_His') . '.xlsx');
    }
}
