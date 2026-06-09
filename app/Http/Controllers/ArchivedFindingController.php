<?php

namespace App\Http\Controllers;

use App\Exports\ArchivedFindingExport;
use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Finding;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\WorkCenter;
use App\Traits\HasPerPagePreference;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ArchivedFindingController extends Controller
{
    use HasPerPagePreference;

    public function index(Request $request)
    {
        Gate::authorize('index_finding');

        $perPage = $this->getPerPage($request);

        $findings = Finding::withAllRelations()
            ->orderBy('closed_at', 'DESC')
            ->archived()
            ->forUserDepartment()
            ->when($request->start_date && $request->end_date, function ($query) use ($request) {
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59'
                ]);
            })
            ->search($request)
            ->paginate($perPage)
            ->withQueryString();

        $findingClauses = FindingClause::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $workCenters = WorkCenter::all();
        $causeCodes = CauseCode::all();

        return Inertia::render("finding/archived/index", [
            'findings' => FindingResource::collection($findings),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
                'start_date' => $request->query('start_date') ?? Carbon::now()->subMonths(3)->format('Y-m-d'),
                'end_date' => $request->query('end_date') ?? Carbon::now()->format('Y-m-d'),
            ],
        ]);
    }

    public function export(Request $request)
    {
        $filters = [
            'start_date'     => $request->query('start_date'),
            'end_date'       => $request->query('end_date'),
            'department_ids' => $request->query('department_ids'),
            'priority_ids' => $request->query('priority_ids'),
        ];

        return Excel::download(new ArchivedFindingExport($filters), 'Archived_Findings_' . now()->format('Ymd_His') . '.xlsx');
    }
}
