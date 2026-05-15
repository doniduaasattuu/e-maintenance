<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionPanel\StoreInspectionPanelRequest;
use App\Http\Requests\InspectionPanel\UpdateInspectionPanelRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionPanelResource;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingType;
use App\Models\InspectionPanel;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InspectionPanelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('index_inspectionpanel');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Gate::authorize('create_inspectionpanel');
    }

    /**
     * Store a newly created resource in storage.
     */
    // App\Http\Controllers\InspectionPanelController.php

    public function store(StoreInspectionPanelRequest $request)
    {
        Gate::authorize('store_inspectionpanel');
        $validated = $request->validated();

        try {
            $inspectionPanel = DB::transaction(function () use ($validated, $request) {
                // 1. Pisahkan data panel dan data finding
                $panelData = Arr::only($validated, [
                    'is_operational',
                    'is_clean',
                    'temperature_cabinet',
                    'temperature_incoming_r',
                    'temperature_incoming_s',
                    'temperature_incoming_t',
                    'temperature_outgoing_r',
                    'temperature_outgoing_s',
                    'temperature_outgoing_t',
                    'current_r',
                    'current_s',
                    'current_t'
                ]);

                // 2. Simpan Inspection Panel
                $inspectionPanel = InspectionPanel::create($panelData);

                // 3. Simpan Inspection Form (Polymorphic/Relation)
                $inspectionPanel->inspectionForm()->create([
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

                return $inspectionPanel;
            });

            if ($validated['has_abnormality']) {
                return redirect()->route('equipments.findings', $validated['equipment_id'])->with('message', [
                    'type' => 'success',
                    'description' => 'Inspection saved successfully with abnormality report.',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionpanels.edit', [
                            'equipment' => $validated['equipment_id'],
                            'inspectionPanel' => $inspectionPanel->id,
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
                    'url' => route('inspectionpanels.edit', [
                        'equipment' => $validated['equipment_id'],
                        'inspectionPanel' => $inspectionPanel->id,
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
    public function show(string $id)
    {
        // Gate::authorize('show_inspectionpanel');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment, InspectionPanel $inspectionPanel)
    {
        Gate::authorize('edit_inspectionpanel');

        return Inertia::render('inspection/panel/edit', [
            'inspectionPanel' => new InspectionPanelResource($inspectionPanel),
            'equipment' => new EquipmentResource($equipment->load('eclass'))
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionPanelRequest $request, Equipment $equipment, InspectionPanel $inspectionPanel)
    {
        Gate::authorize('update_inspectionpanel');

        $inspectionPanel->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // Gate::authorize('delete_inspectionpanel');
    }
}
