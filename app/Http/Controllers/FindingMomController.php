<?php

namespace App\Http\Controllers;

use App\Exports\FindingMomExport;
use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\Finding;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\WorkCenter;
use App\Traits\HasPerPagePreference;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class FindingMomController extends Controller
{
    use HasPerPagePreference;

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Finding::class);

        $perPage = $this->getPerPage($request);

        $hasDateRange = $request->filled('start_date')
            && $request->filled('end_date');

        $oneWeekAgo = now()->subDays(7)->startOfDay();

        $findings = Finding::withAllRelations()
            ->when(
                $hasDateRange,
                function ($query) use ($request) {
                    // Gunakan rentang tanggal pilihan user.
                    $query->whereBetween('created_at', [
                        Carbon::parse($request->start_date)->startOfDay(),
                        Carbon::parse($request->end_date)->endOfDay(),
                    ]);
                },
                function ($query) use ($oneWeekAgo) {
                    // Default: finding yang belum Closed
                    // dibuat dalam 7 hari terakhir,
                    // ATAU finding yang sudah Closed
                    // dalam 7 hari terakhir berdasarkan created_at.
                    $query->where(function ($q) use ($oneWeekAgo) {
                        $q->where(function ($subQuery) use ($oneWeekAgo) {
                            $subQuery
                                ->whereHas(
                                    'status',
                                    fn($sq) => $sq->where('name', '!=', 'Closed')
                                )
                                ->where('created_at', '>=', $oneWeekAgo);
                        })->orWhere(function ($subQuery) use ($oneWeekAgo) {
                            $subQuery
                                ->whereHas(
                                    'status',
                                    fn($sq) => $sq->where('name', 'Closed')
                                )
                                ->where('created_at', '>=', $oneWeekAgo);
                        });
                    });
                }
            )
            ->search($request)
            ->orderByDesc('created_at')
            ->paginate($perPage)
            ->withQueryString();

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $workCenters = WorkCenter::all();
        $causeCodes = CauseCode::all();

        return Inertia::render('finding/mom/index', [
            'findings' => FindingResource::collection($findings),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
            'workCenters' => WorkCenterResource::collection($workCenters),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
                'start_date' => $request->query('start_date')
                    ?? now()->subDays(7)->format('Y-m-d'),
                'end_date' => $request->query('end_date')
                    ?? now()->format('Y-m-d'),
            ],
        ]);
    }

    public function export(Request $request)
    {
        return Excel::download(new FindingMomExport($request), 'Finding_MoM_' . now()->format('Ymd_His') . '.xlsx');
    }
}
