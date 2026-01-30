<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionAirConditioner\StoreInspectionAirConditionerRequest;
use App\Http\Requests\InspectionAirConditioner\UpdateInspectionAirConditionerRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionAirConditionResource;
use App\Models\InspectionAirConditioner;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class InspectionAirConditionerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('index_inspectionairconditioner');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Gate::authorize('create_inspectionairconditioner');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInspectionAirConditionerRequest $request)
    {
        Gate::authorize('store_inspectionairconditioner');
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                $data = Arr::except($validated, ['equipment_id']);

                $inspectionAirConditioner = InspectionAirConditioner::create($data);

                $inspectionAirConditioner->inspectionForm()->create([
                    'equipment_id' => $validated['equipment_id'],
                ]);

                return back()->with('message', [
                    'type' => 'success',
                    'description' => 'Stored successfully',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionairconditioners.edit', $inspectionAirConditioner->id),
                        'method' => 'get',
                    ]
                ]);
            });
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed store inspection air conditioner',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InspectionAirConditioner $inspectionAirConditioner)
    {
        // Gate::authorize('show_inspectionairconditioner');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InspectionAirConditioner $inspectionAirConditioner)
    {
        Gate::authorize('edit_inspectionairconditioner');
        $inspectionAirConditioner->load('inspectionForm.equipment');

        return Inertia::render('inspection/air-conditioner/edit', [
            'inspectionAirConditioner' => new InspectionAirConditionResource($inspectionAirConditioner),
            'equipment' => new EquipmentResource($inspectionAirConditioner->inspectionForm->equipment)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionAirConditionerRequest $request, InspectionAirConditioner $inspectionAirConditioner)
    {
        Gate::authorize('update_inspectionairconditioner');

        $inspectionAirConditioner->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InspectionAirConditioner $inspectionAirConditioner)
    {
        // Gate::authorize('delete_inspectionairconditioner');
    }
}
