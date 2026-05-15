<?php

namespace App\Http\Controllers;

use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingStatusResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Equipment;
use App\Models\EquipmentInspectionForm;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EquipmentInspectionFormController extends Controller
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
    public function create(Equipment $equipment)
    {
        Gate::authorize('create_inspection');

        $equipment->load(['eclass', 'status']);
        $class = $equipment->eclass->formable_type;
        $status = $equipment->status->code;

        if ($status !== 'INST') {
            return back()->with('message', [
                'type' => 'info',
                'description' => 'Equipment is not installed. Inspection form cannot be filled.',
            ]);
        } else {
            $findingClauses = FindingClause::all();
            $findingStatuses = FindingStatus::all();
            $findingPriorities = FindingPriority::all();
            $causeCodes = CauseCode::all();
            $departments = Department::all();
            $workCenters = WorkCenter::all();


            switch ($class) {
                case "MOTOR":
                    return Inertia::render('inspection/motor/create', [
                        'equipment' => new EquipmentResource($equipment),
                        'findingClauses' => FindingClauseResource::collection($findingClauses),
                        'findingStatuses' => FindingStatusResource::collection($findingStatuses),
                        'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
                        'causeCodes' => CauseCodeResource::collection($causeCodes),
                        'departments' => DepartmentResource::collection($departments),
                        'workCenters' => WorkCenterResource::collection($workCenters),
                    ]);
                case "PANEL":
                    return Inertia::render('inspection/panel/create', [
                        'equipment' => new EquipmentResource($equipment),
                        'findingClauses' => FindingClauseResource::collection($findingClauses),
                        'findingStatuses' => FindingStatusResource::collection($findingStatuses),
                        'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
                        'causeCodes' => CauseCodeResource::collection($causeCodes),
                        'departments' => DepartmentResource::collection($departments),
                        'workCenters' => WorkCenterResource::collection($workCenters),
                    ]);
                case "TRANSFORMER":
                    return Inertia::render('inspection/transformer/create', [
                        'equipment' => new EquipmentResource($equipment),
                        'findingClauses' => FindingClauseResource::collection($findingClauses),
                        'findingStatuses' => FindingStatusResource::collection($findingStatuses),
                        'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
                        'causeCodes' => CauseCodeResource::collection($causeCodes),
                        'departments' => DepartmentResource::collection($departments),
                        'workCenters' => WorkCenterResource::collection($workCenters),
                    ]);
                case "AC":
                    return Inertia::render('inspection/air-conditioner/create', [
                        'equipment' => new EquipmentResource($equipment),
                        'findingClauses' => FindingClauseResource::collection($findingClauses),
                        'findingStatuses' => FindingStatusResource::collection($findingStatuses),
                        'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
                        'causeCodes' => CauseCodeResource::collection($causeCodes),
                        'departments' => DepartmentResource::collection($departments),
                        'workCenters' => WorkCenterResource::collection($workCenters),
                    ]);
                default:
                    return back()->with('message', [
                        'type' => 'info',
                        'description' => 'Equipment form for ' . $class . ' is not exists. Please contact Administrator.',
                    ]);
            }
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }
}
