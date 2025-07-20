<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionMotor\StoreInspectionMotorRequest;
use App\Http\Requests\InspectionMotor\UpdateInspectionMotorRequest;
use App\Http\Resources\InspectionMotorResource;
use App\Models\EquipmentInspectionForm;
use App\Models\InspectionMotor;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class InspectionMotorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_inspectionmotor');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInspectionMotorRequest $request)
    {
        Gate::authorize('create_inspectionmotor');
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                $data = Arr::except($validated, ['equipment_id']);

                $inspectionMotor = InspectionMotor::create($data);

                $inspectionMotor->inspectionForm()->create([
                    'equipment_id' => $validated['equipment_id'],
                ]);

                return back()->with('message', [
                    'type' => 'success',
                    'description' => 'Stored successfully',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionmotors.edit', $inspectionMotor->id),
                        'method' => 'get',
                    ]
                ]);
            });
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed store inspection motor',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InspectionMotor $inspectionMotor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InspectionMotor $inspectionMotor)
    {
        Gate::authorize('update_inspectionmotor');

        return Inertia::render('inspection/motor/edit', [
            'inspectionMotor' => new InspectionMotorResource($inspectionMotor->load('inspectionForm.equipment')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionMotorRequest $request, InspectionMotor $inspectionMotor)
    {
        Gate::authorize('update_inspectionmotor');

        $inspectionMotor->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InspectionMotor $inspectionMotor)
    {
        //
    }
}
