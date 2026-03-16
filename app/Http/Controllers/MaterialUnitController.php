<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaterialUnit\StoreMaterialUnitRequest;
use App\Http\Requests\MaterialUnit\UpdateMaterialUnitRequest;
use App\Http\Resources\MaterialUnitResource;
use App\Models\MaterialUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class MaterialUnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_materialunit');

        $materialUnits = MaterialUnit::search($request)->paginate()->withQueryString();

        return Inertia::render('material-unit/index', [
            'materialUnits' => MaterialUnitResource::collection($materialUnits),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_materialunit');

        return Inertia::render('material-unit/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialUnitRequest $request)
    {
        Gate::authorize('store_materialunit');

        try {
            $validated = $request->validated();

            MaterialUnit::create(['name' => $validated['name']]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating unit',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MaterialUnit $materialUnit)
    {
        // Gate::authorize('show_materialunit');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaterialUnit $materialUnit)
    {
        Gate::authorize('edit_materialunit');

        return Inertia::render('material-unit/edit', [
            'materialUnit' => new MaterialUnitResource($materialUnit),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialUnitRequest $request, MaterialUnit $materialUnit)
    {
        Gate::authorize('update_materialunit');

        try {
            $validated = $request->validated();

            $materialUnit->update([
                'name' => $validated['name'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating unit',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaterialUnit $materialUnit)
    {
        Gate::authorize('delete_materialunit');

        try {
            $materialUnit->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Unit deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Unit is not found',
            ]);
        }
    }
}
