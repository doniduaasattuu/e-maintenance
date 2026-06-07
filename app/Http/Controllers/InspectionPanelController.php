<?php

namespace App\Http\Controllers;

use App\Exports\PanelTrendExport;
use App\Http\Requests\InspectionPanel\StoreInspectionPanelRequest;
use App\Http\Requests\InspectionPanel\UpdateInspectionPanelRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionMotorResource;
use App\Http\Resources\InspectionPanelResource;
use App\Models\Equipment;
use App\Models\Finding;
use App\Models\FindingImage;
use App\Models\FindingType;
use App\Models\InspectionPanel;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

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
    public function show(Request $request, Equipment $equipment)
    {
        Gate::authorize('index_inspectionpanel');

        // 1. Ambil input Date Range (default 30 hari terakhir)
        $startDate = $request->input('start_date', Carbon::now()->subDays(30)->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->toDateString());

        $from = Carbon::parse($startDate)->startOfDay();
        $to = Carbon::parse($endDate)->endOfDay();

        // 2. Query Eager Loading via Polymorphic Relation
        $inspections = $equipment->inspections()
            ->with(['formable'])
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('created_at', 'asc')
            ->get();

        // 3. Inisialisasi Group Data Array
        $incomingPanel = [];
        $outgoingPanel = [];
        $cabinetPanel  = [];
        $amperePanel   = [];

        // 4. Mapping Data secara efisien dalam satu kali looping loop (O(n))
        foreach ($inspections as $form) {
            $details = $form->formable;

            // Pastikan data formable adalah instansiasi dari InspectionPanel
            if ($details instanceof \App\Models\InspectionPanel) {
                $formattedDate = $form->created_at->format('d M'); // Hasil: "09 May"

                $incomingPanel[] = [
                    'Date' => $formattedDate,
                    'r' => (float) $details->temperature_incoming_r,
                    's' => (float) $details->temperature_incoming_s,
                    't' => (float) $details->temperature_incoming_t,
                ];

                $outgoingPanel[] = [
                    'Date' => $formattedDate,
                    'r' => (float) $details->temperature_outgoing_r,
                    's' => (float) $details->temperature_outgoing_s,
                    't' => (float) $details->temperature_outgoing_t,
                ];

                $cabinetPanel[] = [
                    'Date' => $formattedDate,
                    'cabinet' => (float) $details->temperature_cabinet,
                ];

                $amperePanel[] = [
                    'Date' => $formattedDate,
                    'r' => (float) $details->current_r,
                    's' => (float) $details->current_s,
                    't' => (float) $details->current_t,
                ];
            }
        }

        // 5. Generate Chart Config sesuai standar ShadcnUI ChartConfig type
        $configs = $this->getTrendChartConfigs();

        return Inertia::render('equipment/trend/panel', [
            'equipment' => new EquipmentResource($equipment->load('status', 'eclass')),
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'trends' => [
                'incoming' => $incomingPanel,
                'outgoing' => $outgoingPanel,
                'cabinet'  => $cabinetPanel,
                'ampere'   => $amperePanel,
            ],
            'configs' => $configs
        ]);
    }

    /**
     * Menyediakan struktur config warna & label terpusat dari backend
     */
    private function getTrendChartConfigs(): array
    {
        // Tema warna default ShadcnUI (var(--chart-1), dst)
        $phaseConfig = [
            'r' => ['label' => 'Phase R', 'color' => 'var(--chart-1)'],
            's' => ['label' => 'Phase S', 'color' => 'var(--chart-2)'],
            't' => ['label' => 'Phase T', 'color' => 'var(--chart-3)'],
        ];

        return [
            'temperature' => $phaseConfig,
            'ampere' => $phaseConfig,
            'cabinet' => [
                'cabinet' => ['label' => 'Cabinet', 'color' => 'var(--chart-5)'],
            ]
        ];
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Equipment $equipment, InspectionPanel $inspectionPanel)
    {
        Gate::authorize('edit_inspectionpanel');

        return Inertia::render('inspection/panel/edit', [
            'inspectionPanel' => new InspectionPanelResource($inspectionPanel),
            'equipment' => new EquipmentResource($equipment->load(['eclass', 'status'])),
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

    public function export(Request $request, Equipment $equipment)
    {

        return Excel::download(new PanelTrendExport($equipment), 'Panel_trend.xlsx');
    }
}
