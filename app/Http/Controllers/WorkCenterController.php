<?php

namespace App\Http\Controllers;

use App\Exports\WorkCenterExport;
use App\Http\Requests\WorkCenter\StoreWorkCenterRequest;
use App\Http\Requests\WorkCenter\UpdateWorkCenterRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\Department;
use App\Models\WorkCenter;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class WorkCenterController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_workcenter');

        $perPage = $this->getPerPage($request);

        $workCenters = WorkCenter::with('department')->search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('work-center/index', [
            'workCenters' => WorkCenterResource::collection($workCenters),
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
        Gate::authorize('create_workcenter');

        return Inertia::render('work-center/create', [
            'departments' => DepartmentResource::collection(Department::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkCenterRequest $request)
    {
        Gate::authorize('store_workcenter');

        $validated = $request->validated();

        WorkCenter::create($validated);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(WorkCenter $workCenter)
    {
        // Gate::authorize('show_workcenter');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(WorkCenter $workCenter)
    {
        Gate::authorize('edit_workcenter');

        return Inertia::render('work-center/edit', [
            'workCenter' => new WorkCenterResource($workCenter),
            'departments' => DepartmentResource::collection(Department::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateWorkCenterRequest $request, WorkCenter $workCenter)
    {
        Gate::authorize('update_workcenter');

        try {
            $validated = $request->validated();

            $workCenter->update($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating work center',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(WorkCenter $workCenter)
    {
        Gate::authorize('delete_workcenter');

        $workCenter->delete();

        return redirect()->route('work-centers.index')->with('message', [
            'type' => 'success',
            'description' => 'Work center deleted successfully',
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(new WorkCenterExport(), 'Work_Centers_' . now()->format('Ymd_His') . '.xlsx');
    }
}
