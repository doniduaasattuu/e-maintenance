<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionMotor\StoreInspectionMotorRequest;
use App\Http\Requests\InspectionMotor\UpdateInspectionMotorRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionMotorResource;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingType;
use App\Models\InspectionMotor;
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
        // Gate::authorize('create_inspectionmotor');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInspectionMotorRequest $request)
    {
        Gate::authorize('store_inspectionmotor');
        $validated = $request->validated();

        try {
            $inspectionMotor = DB::transaction(function () use ($validated, $request) {
                // 1. Pisahkan data motor dan data finding
                $motorData = Arr::only($validated, [
                    'is_operational',
                    'is_clean',
                    'number_of_greasing',
                    'temperature_de',
                    'temperature_body',
                    'temperature_nde',
                    'vibration_dev',
                    'vibration_deh',
                    'vibration_dea',
                    'vibration_def',
                    'is_noisy_de',
                    'vibration_ndev',
                    'vibration_ndeh',
                    'vibration_ndef',
                    'is_noisy_nde',
                ]);

                // 2. Simpan Inspection Motor
                $inspectionMotor = InspectionMotor::create($motorData);

                // 3. Simpan Inspection Form (Polymorphic/Relation)
                $inspectionMotor->inspectionForm()->create([
                    'equipment_id' => $validated['equipment_id'],
                ]);

                // 4. Proses Abnormality jika dicentang
                if ($validated['has_abnormality']) {
                    $findingData = Arr::only($validated, [
                        'finding_clause_id',
                        'finding_status_id',
                        'finding_priority_id',
                        'cause_code_id',
                        'department_id',
                        'work_center_id',
                        'description',
                        'equipment_id',
                    ]);

                    $findingData['finding_type_id'] = FindingType::where('name', 'Abnormality')->firstOrFail()->id;
                    $findingData['inspected_by'] = auth()->id();
                    $findingData['functional_location_id'] = Equipment::findOrFail($validated['equipment_id'])->functional_location_id;

                    // Pastikan anda memiliki relasi findings() di model Equipment atau User
                    $finding = Finding::create($findingData);

                    // 5. Handle Images 
                    if (request()->hasFile('images')) {
                        foreach (request()->file('images') as $image) {
                            $path = $image->store('images/findings/' . $finding->id, 'public');
                            FindingImage::create([
                                'finding_id'    => $finding->id,
                                'file_path'     => $path,
                                'category'      => 'before',
                                'original_name' => $image->getClientOriginalName(),
                                'closed_at'     => null,
                            ]);
                        }
                    }
                }

                return $inspectionMotor;
            });

            if ($validated['has_abnormality']) {
                return redirect()->route('equipments.findings', $validated['equipment_id'])->with('message', [
                    'type' => 'success',
                    'description' => 'Inspection saved successfully with abnormality report.',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionmotors.edit', [
                            'equipment' => $validated['equipment_id'],
                            'inspectionMotor' => $inspectionMotor->id,
                        ]),
                        'method' => 'get',
                    ]
                ]);
            };

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Inspection saved successfully.',
                'action' => [
                    'label' => 'Edit',
                    'url' => route('inspectionmotors.edit', [
                        'equipment' => $validated['equipment_id'],
                        'inspectionMotor' => $inspectionMotor->id,
                    ]),
                    'method' => 'get',
                ]
            ]);
        } catch (\Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => 'Error: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InspectionMotor $inspectionMotor)
    {
        // Gate::authorize('show_inspectionmotor');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment, InspectionMotor $inspectionMotor)
    {
        Gate::authorize('edit_inspectionmotor');

        return Inertia::render('inspection/motor/edit', [
            'inspectionMotor' => new InspectionMotorResource($inspectionMotor),
            'equipment' => new EquipmentResource($equipment->load(['eclass', 'status'])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionMotorRequest $request, Equipment $equipment, InspectionMotor $inspectionMotor)
    {
        Gate::authorize('update_inspectionmotor');

        $inspectionMotor->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InspectionMotor $inspectionMotor)
    {
        // Gate::authorize('delete_inspectionmotor');
    }
}
