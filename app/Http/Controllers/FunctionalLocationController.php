<?php

namespace App\Http\Controllers;

use App\Http\Requests\FunctionalLocation\StoreFunctionalLocationRequest;
use App\Http\Requests\FunctionalLocation\UpdateFunctionalLocationRequest;
use App\Http\Resources\EquipmentClassResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\EquipmentStatusResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FunctionalLocationResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FunctionalLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_functionallocation');

        $functionalLocations = FunctionalLocation::search($request)->paginate()->withQueryString();

        if ($request->expectsJson() && $request->filled('query')) {
            return response()->json(FunctionalLocationResource::collection($functionalLocations));
        }

        return Inertia::render('functional-location/index', [
            'functionalLocations' => FunctionalLocationResource::collection($functionalLocations),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_functionallocation');

        return Inertia::render('functional-location/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFunctionalLocationRequest $request)
    {
        Gate::authorize('store_functionallocation');

        try {
            $validated = $request->validated();

            FunctionalLocation::create($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating functional location',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('show_functionallocation');

        return Inertia::render('functional-location/show', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
            'equipments' => EquipmentResource::collection($functionalLocation->equipments()->with([
                'eclass',
                'status',
                'functionalLocation',
            ])
                ->latest()
                ->paginate(10)),
            'findings' => FindingResource::collection($functionalLocation
                ->findings()
                ->withDefaultRelations()
                ->latest()
                ->paginate(10)),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('edit_functionallocation');

        return Inertia::render('functional-location/edit', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFunctionalLocationRequest $request, FunctionalLocation $functionalLocation)
    {
        Gate::authorize('update_functionallocation');

        try {
            $validated = $request->validated();

            $functionalLocation->update([
                'code' => $validated['code'],
                'description' => $validated['description'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating functional location',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('delete_functionallocation');

        try {
            $functionalLocation->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Functional location deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Functional location is not found',
            ]);
        }
    }
}
