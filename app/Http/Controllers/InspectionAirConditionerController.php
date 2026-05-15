<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionAirConditioner\StoreInspectionAirConditionerRequest;
use App\Http\Requests\InspectionAirConditioner\UpdateInspectionAirConditionerRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionAirConditionResource;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingType;
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
            $inspectionAc = DB::transaction(function () use ($validated, $request) {
                // 1. Pisahkan data ac dan data finding
                $acData = Arr::only($validated, [
                    'is_operational',
                    'is_drain_leaking',
                    'current_load',
                    'blowing_temperature',
                    'ambient_temperature',
                    'is_filter_clean',
                    'is_evaporator_clean',
                    'is_condensor_clean',
                ]);

                // 2. Simpan Inspection Ac
                $inspectionAc = InspectionAirConditioner::create($acData);

                // 3. Simpan Inspection Form (Polymorphic/Relation)
                $inspectionAc->inspectionForm()->create([
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

                return $inspectionAc;
            });

            if ($validated['has_abnormality']) {
                return redirect()->route('equipments.findings', $validated['equipment_id'])->with('message', [
                    'type' => 'success',
                    'description' => 'Inspection saved successfully with abnormality report.',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionairconditioners.edit', [
                            'equipment' => $validated['equipment_id'],
                            'inspectionAirConditioner' => $inspectionAc->id,
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
                    'url' => route('inspectionairconditioners.edit', [
                        'equipment' => $validated['equipment_id'],
                        'inspectionAirConditioner' => $inspectionAc->id,
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
    public function show(InspectionAirConditioner $inspectionAirConditioner)
    {
        // Gate::authorize('show_inspectionairconditioner');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment, InspectionAirConditioner $inspectionAirConditioner)
    {
        Gate::authorize('edit_inspectionairconditioner');

        return Inertia::render('inspection/air-conditioner/edit', [
            'inspectionAirConditioner' => new InspectionAirConditionResource($inspectionAirConditioner),
            'equipment' => new EquipmentResource($equipment->load('eclass')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionAirConditionerRequest $request, Equipment $equipment, InspectionAirConditioner $inspectionAirConditioner)
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
