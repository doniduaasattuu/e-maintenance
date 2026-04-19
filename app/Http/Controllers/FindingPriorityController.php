<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindingPriority\StoreFindingPriorityRequest;
use App\Http\Requests\FindingPriority\UpdateFindingPriorityRequest;
use App\Http\Resources\FindingPriorityResource;
use App\Models\FindingPriority;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FindingPriorityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingpriority');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $findingPriorities = FindingPriority::search($request)->paginate()->withQueryString();

        return Inertia::render('finding-priority/index', [
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_findingpriority');

        return Inertia::render('finding-priority/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingPriorityRequest $request)
    {
        Gate::authorize('store_findingpriority');

        try {
            FindingPriority::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating finding priority',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FindingPriority $findingPriority)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FindingPriority $findingPriority)
    {
        Gate::authorize('edit_findingpriority');

        return Inertia::render('finding-priority/edit', [
            'findingPriority' => new FindingPriorityResource($findingPriority),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingPriorityRequest $request, FindingPriority $findingPriority)
    {
        Gate::authorize('update_findingpriority');

        try {
            $findingPriority->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating finding priority',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FindingPriority $findingPriority)
    {
        Gate::authorize('delete_findingpriority');

        try {
            $findingPriority->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding priority deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Finding priority is not found',
            ]);
        }
    }
}
