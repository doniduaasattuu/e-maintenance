<?php

namespace App\Http\Controllers;

use App\Http\Requests\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Equipment\UpdateEquipmentRequest;
use App\Http\Resources\EquipmentClassResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\EquipmentStatusResource;
use App\Http\Resources\RepositoryResource;
use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_equipment');

        $equipments = Equipment::with(['functionalLocation', 'eclass', 'status'])->search($request)->paginate(10)->withQueryString();
        $equipmentClasses = EquipmentClass::all();
        $equipmentStatuses = EquipmentStatus::all();

        if ($request->expectsJson() && $request->filled('query')) {
            return response()->json(EquipmentResource::collection($equipments));
        }

        return Inertia::render('equipment/index', [
            'equipments' => EquipmentResource::collection($equipments),
            'equipmentClasses' => EquipmentClassResource::collection($equipmentClasses),
            'equipmentStatuses' => EquipmentStatusResource::collection($equipmentStatuses),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_equipment');

        $equipmentClasses = EquipmentClass::all();
        $equipmentStatuses = EquipmentStatus::all();

        return Inertia::render('equipment/create', [
            'equipmentClasses' => EquipmentClassResource::collection($equipmentClasses),
            'equipmentStatuses' => EquipmentStatusResource::collection($equipmentStatuses),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentRequest $request)
    {
        Gate::authorize('store_equipment');

        try {
            $validated = $request->validated();

            Equipment::create($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating equipment',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        Gate::authorize('show_equipment');

        return Inertia::render('equipment/show', [
            'equipment' => new EquipmentResource($equipment->load(['functionalLocation', 'eclass', 'status'])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment)
    {
        Gate::authorize('edit_equipment');

        $equipmentClasses = EquipmentClass::all();
        $equipmentStatuses = EquipmentStatus::all();

        return Inertia::render('equipment/edit', [
            'equipment' => new EquipmentResource($equipment->load('functionalLocation')),
            'equipmentClasses' => EquipmentClassResource::collection($equipmentClasses),
            'equipmentStatuses' => EquipmentStatusResource::collection($equipmentStatuses),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        Gate::authorize('update_equipment');

        try {
            $equipment->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating equipment',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment)
    {
        Gate::authorize('delete_equipment');

        DB::beginTransaction();

        try {
            $directoryPath = 'images/equipments/' . $equipment->id;

            $equipment->images()->delete();
            $equipment->delete();

            if (Storage::disk('public')->exists($directoryPath)) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }

            DB::commit();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Equipment deleted successfully',
            ]);
        } catch (Throwable $e) {
            DB::rollBack();

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed to delete equipment: ' . $e->getMessage(),
            ]);
        }
    }
}
