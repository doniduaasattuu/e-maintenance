<?php

namespace App\Http\Controllers;

use App\Exports\EquipmentExport;
use App\Exports\FindingExport;
use App\Http\Requests\Equipment\StoreEquipmentRequest;
use App\Http\Requests\Equipment\UpdateEquipmentRequest;
use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\EquipmentClassResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\EquipmentStatusResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\WorkCenter;
use App\Traits\HasPerPagePreference;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Throwable;

use function Pest\Laravel\session;

class EquipmentController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_equipment');

        if ($request->expectsJson()) {
            $query = Equipment::query()->with(['functionalLocation', 'eclass', 'status']);

            if ($request->filled('query')) {
                $query->search($request);
            }

            if ($request->filled('functionalLocationId')) {
                $query->where('functional_location_id', $request->query('functionalLocationId'));
            }

            $equipments = $query->take(20)->get();

            return response()->json(EquipmentResource::collection($equipments));
        }

        $perPage = $this->getPerPage($request);

        $equipments = Equipment::with(['functionalLocation', 'eclass', 'status'])->search($request)->paginate($perPage)->withQueryString();
        $equipmentClasses = EquipmentClass::all();
        $equipmentStatuses = EquipmentStatus::all();

        // if ($request->expectsJson() && $request->filled('query')) {
        //     if ($request->filled('functionalLocationId')) {
        //         $equipments->where('functional_location_id', $request->query('functionalLocationId'));
        //     }

        //     return response()->json(EquipmentResource::collection($equipments));
        // }

        return Inertia::render('equipment/index', [
            'equipments' => EquipmentResource::collection($equipments),
            'equipmentClasses' => EquipmentClassResource::collection($equipmentClasses),
            'equipmentStatuses' => EquipmentStatusResource::collection($equipmentStatuses),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
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
    public function show(Request $request, Equipment $equipment)
    {
        Gate::authorize('show_equipment');

        $perPage = $this->getPerPage($request);

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $workCenters = WorkCenter::all();
        $causeCodes = CauseCode::all();

        $equipment->load([
            'functionalLocation',
            'eclass',
            'status',
        ]);

        return Inertia::render('equipment/show', [
            'equipment' => new EquipmentResource($equipment),
            'findings' => FindingResource::collection($equipment
                ->findings()
                ->search($request)
                ->withAllRelations()
                ->latest()
                ->paginate($perPage)),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
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

    public function export(Request $request)
    {
        $filters = [
            'functional_location_id' => $request->query('functional_location_id'),
            'status_ids' => $request->query('status_ids'),
            'class_ids' => $request->query('class_ids'),
        ];

        return Excel::download(new EquipmentExport($filters), 'Equipments_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function equipmentFindingExport(Request $request)
    {
        $filters = [
            'equipment_id'   => $request->query('equipment_id'),
            'start_date'     => $request->query('start_date'),
            'end_date'       => $request->query('end_date'),
        ];

        return Excel::download(new FindingExport($filters), 'Equipment_Findings_' . now()->format('Ymd_His') . '.xlsx');
    }
}
