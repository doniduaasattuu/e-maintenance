<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionTransformer\StoreInspectionTransformerRequest;
use App\Http\Requests\InspectionTransformer\UpdateInspectionTransformerRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionTransformerResource;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingType;
use App\Models\InspectionTransformer;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InspectionTransformerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('index_inspectiontransformer');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Gate::authorize('create_inspectiontransformer');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInspectionTransformerRequest $request)
    {
        Gate::authorize('store_inspectiontransformer');
        $validated = $request->validated();

        try {
            $inspectionTransformer = DB::transaction(function () use ($validated, $request) {
                // 1. Pisahkan data transformer dan data finding
                $transformerData = Arr::only($validated, [
                    'is_operational',
                    'is_clean',
                    'primary_current_r',
                    'primary_current_s',
                    'primary_current_t',
                    'primary_voltage_r',
                    'primary_voltage_s',
                    'primary_voltage_t',
                    'secondary_current_r',
                    'secondary_current_s',
                    'secondary_current_t',
                    'secondary_voltage_r',
                    'secondary_voltage_s',
                    'secondary_voltage_t',
                    'temperature_oil',
                    'temperature_winding',
                    'desicant_level_id',
                ]);

                // 2. Simpan Inspection Transformer
                $inspectionTransformer = InspectionTransformer::create($transformerData);

                // 3. Simpan Inspection Form (Polymorphic/Relation)
                $inspectionTransformer->inspectionForm()->create([
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

                return $inspectionTransformer;
            });

            if ($validated['has_abnormality']) {
                return redirect()->route('equipments.findings', $validated['equipment_id'])->with('message', [
                    'type' => 'success',
                    'description' => 'Inspection saved successfully with abnormality report.',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectiontransformers.edit', [
                            'equipment' => $validated['equipment_id'],
                            'inspectionTransformer' => $inspectionTransformer->id,
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
                    'url' => route('inspectiontransformers.edit', [
                        'equipment' => $validated['equipment_id'],
                        'inspectionTransformer' => $inspectionTransformer->id,
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
    public function show(InspectionTransformer $inspectionTransformer)
    {
        // Gate::authorize('show_inspectiontransformer');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment, InspectionTransformer $inspectionTransformer)
    {
        Gate::authorize('edit_inspectiontransformer');

        return Inertia::render('inspection/transformer/edit', [
            'inspectionTransformer' => new InspectionTransformerResource($inspectionTransformer),
            'equipment' => new EquipmentResource($equipment->load(['eclass', 'status'])),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionTransformerRequest $request, Equipment $equipment, InspectionTransformer $inspectionTransformer)
    {
        Gate::authorize('update_inspectiontransformer');

        $inspectionTransformer->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InspectionTransformer $inspectionTransformer)
    {
        // Gate::authorize('delete_inspectiontransformer');
    }
}
