<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentStatus\StoreEquipmentStatusRequest;
use App\Http\Requests\EquipmentStatus\UpdateEquipmentStatusRequest;
use App\Http\Resources\EquipmentStatusResource;
use App\Models\EquipmentStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class EquipmentStatusController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_equipmentstatus');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $equipmentStatuses = EquipmentStatus::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('equipment-status/index', [
            'equipmentStatuses' => EquipmentStatusResource::collection($equipmentStatuses),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_equipmentstatus');

        return Inertia::render('equipment-status/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentStatusRequest $request)
    {
        Gate::authorize('store_equipmentstatus');

        try {
            EquipmentStatus::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating equipment status',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(EquipmentStatus $equipmentStatus)
    {
        // Gate::authorize('show_equipmentstatus');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EquipmentStatus $equipmentStatus)
    {
        Gate::authorize('edit_equipmentstatus');

        return Inertia::render('equipment-status/edit', [
            'equipmentStatus' => new EquipmentStatusResource($equipmentStatus),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentStatusRequest $request, EquipmentStatus $equipmentStatus)
    {
        Gate::authorize('update_equipmentstatus');

        try {
            $equipmentStatus->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating equipment status',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentStatus $equipmentStatus)
    {
        Gate::authorize('delete_equipmentstatus');

        try {
            $equipmentStatus->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Equipment status deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Equipment status is not found',
            ]);
        }
    }
}
