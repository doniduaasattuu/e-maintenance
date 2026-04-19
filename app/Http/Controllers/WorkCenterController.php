<?php

namespace App\Http\Controllers;

use App\Http\Requests\WorkCenter\StoreWorkCenterRequest;
use App\Http\Requests\WorkCenter\UpdateWorkCenterRequest;
use App\Http\Resources\WorkCenterResource;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class WorkCenterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_workcenter');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $workCenters = WorkCenter::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('work-center/index', [
            'workCenters' => WorkCenterResource::collection($workCenters),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_workcenter');

        return Inertia::render('work-center/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreWorkCenterRequest $request)
    {
        Gate::authorize('store_workcenter');

        $validated = $request->validated();

        WorkCenter::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
        ]);

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

            $workCenter->update([
                'name' => $validated['name'],
                'code' => $validated['code'],
            ]);

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
}
