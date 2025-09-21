<?php

namespace App\Http\Controllers;

use App\Http\Requests\Unit\StoreUnitRequest;
use App\Http\Requests\Unit\UpdateUnitRequest;
use App\Http\Resources\UnitResource;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_unit');

        $units = Unit::search($request)->paginate()->withQueryString();

        return Inertia::render('unit/index', [
            'units' => UnitResource::collection($units),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_unit');

        return Inertia::render('unit/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUnitRequest $request)
    {
        Gate::authorize('create_unit');

        try {
            $validated = $request->validated();

            Unit::create(['name' => $validated['name']]);

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
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        Gate::authorize('update_unit');

        return Inertia::render('unit/edit', [
            'unit' => new UnitResource($unit),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUnitRequest $request, Unit $unit)
    {
        Gate::authorize('update_unit');

        try {
            $validated = $request->validated();

            $unit->update([
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
    public function destroy(Unit $unit)
    {
        Gate::authorize('delete_unit');

        try {
            $unit->delete();

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
