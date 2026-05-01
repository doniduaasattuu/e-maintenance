<?php

namespace App\Http\Controllers;

use App\Exports\FindingExport;
use App\Exports\FunctionalLocationExport;
use App\Http\Requests\FunctionalLocation\StoreFunctionalLocationRequest;
use App\Http\Requests\FunctionalLocation\UpdateFunctionalLocationRequest;
use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
use App\Http\Resources\FunctionalLocationResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FindingType;
use App\Models\FunctionalLocation;
use App\Models\WorkCenter;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class FunctionalLocationController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_functionallocation');

        $perPage = $this->getPerPage($request);

        $functionalLocations = FunctionalLocation::search($request)->paginate($perPage)->withQueryString();

        if ($request->expectsJson() && $request->filled('query')) {
            return response()->json(FunctionalLocationResource::collection($functionalLocations));
        }

        return Inertia::render('functional-location/index', [
            'functionalLocations' => FunctionalLocationResource::collection($functionalLocations),
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
        Gate::authorize('create_functionallocation');

        return Inertia::render('functional-location/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFunctionalLocationRequest $request)
    {
        Gate::authorize('store_functionallocation');

        try {
            $validated = $request->validated();

            FunctionalLocation::create($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating functional location',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, FunctionalLocation $functionalLocation)
    {
        Gate::authorize('show_functionallocation');

        $perPage = $this->getPerPage($request);

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $workCenters = WorkCenter::all();
        $causeCodes = CauseCode::all();

        return Inertia::render('functional-location/show', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
            'equipments' => EquipmentResource::collection($functionalLocation->equipments()->with([
                'eclass',
                'status',
                'functionalLocation',
            ])
                ->latest()
                ->paginate($perPage)),
            'findings' => FindingResource::collection($functionalLocation
                ->findings()
                ->search($request)
                ->withAllRelations()
                ->latest()
                ->paginate($perPage)),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
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
    public function edit(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('edit_functionallocation');

        return Inertia::render('functional-location/edit', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFunctionalLocationRequest $request, FunctionalLocation $functionalLocation)
    {
        Gate::authorize('update_functionallocation');

        try {
            $validated = $request->validated();

            $functionalLocation->update([
                'code' => $validated['code'],
                'description' => $validated['description'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating functional location',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('delete_functionallocation');

        try {
            $functionalLocation->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Functional location deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Functional location is not found',
            ]);
        }
    }

    public function export(Request $request)
    {
        $filters = [
            'area' => $request->query('area'),
        ];

        return Excel::download(new FunctionalLocationExport($filters), 'Functional_Locations_' . now()->format('Ymd_His') . '.xlsx');
    }

    public function functionalLocationFindingExport(Request $request)
    {
        $filters = [
            'functional_location_id'   => $request->query('functional_location_id'),
            'start_date'     => $request->query('start_date'),
            'end_date'       => $request->query('end_date'),
        ];

        return Excel::download(new FindingExport($filters), 'Functional_Location_Findings_' . now()->format('Ymd_His') . '.xlsx');
    }
}
