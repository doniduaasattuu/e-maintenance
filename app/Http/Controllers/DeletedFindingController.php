<?php

namespace App\Http\Controllers;

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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class DeletedFindingController extends Controller
{
    use HasPerPagePreference;

    public function index(Request $request)
    {
        Gate::authorize('viewAnyDeleted', Finding::class);

        $perPage = $this->getPerPage($request);

        $findingClauses = FindingClause::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $workCenters = WorkCenter::all();
        $causeCodes = CauseCode::all();

        $findings = Finding::onlyTrashed()
            ->withAllRelations()
            ->latest('deleted_at')
            ->search($request)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('finding/deleted/index', [
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

    public function restore(Finding $finding)
    {
        Gate::authorize('restore', $finding);

        $finding->restore();

        return back()->with('message', [
            'type' => 'success',
            'description' => 'Finding restored successfully.',
        ]);
    }

    public function forceDelete(Request $request, Finding $finding)
    {

        Gate::authorize('forceDelete', $finding);

        try {
            DB::transaction(function () use ($finding) {

                $directoryPath = 'images/findings/' . $finding->id;

                $finding->images()->delete();

                $finding->forceDelete();

                if (Storage::disk('public')->exists($directoryPath)) {

                    Storage::disk('public')->deleteDirectory($directoryPath);
                }
            });

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding deleted permanently.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage()
            ]);
        }
    }
}
