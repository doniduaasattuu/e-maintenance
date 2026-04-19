<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use App\Http\Resources\CauseCodeResource;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
use App\Models\CauseCode;
use App\Models\Department;
use App\Models\FindingClause;
use App\Models\FindingImage;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FindingType;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

abstract class FindingController extends Controller
{
    abstract protected function getTypeCode(): string;

    protected $map = [
        'AUD' => 'audit',
        'ABN' => 'abnormality',
    ];

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_finding');

        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $findings = Finding::with([
            'clause',
            'status',
            'priority',
            'department',
            'causeCode',
            'equipment',
            'functionalLocation',
            'inspector',
            'verifier',
            'images',
        ])->orderBy('created_at', 'DESC')
            ->forUserDepartment()
            ->whereHas('type', fn($q) => $q->where('code', $this->getTypeCode()))
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
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();
        $causeCodes = CauseCode::all();

        return Inertia::render("finding/{$this->map[$this->getTypeCode()]}/index", [
            'findings' => FindingResource::collection($findings),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_finding');

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $causeCodes = CauseCode::all();
        $departments = Department::all();

        return Inertia::render("finding/{$this->map[$this->getTypeCode()]}/create", [
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    protected function performStore(array $validatedData)
    {
        return DB::transaction(function () use ($validatedData) {
            $validatedData['inspected_by'] = auth()->id();

            $type = FindingType::where('code', $this->getTypeCode())->firstOrFail();
            $validatedData['finding_type_id'] = $type->id;

            $finding = Finding::create($validatedData);

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

            return $finding;
        });
    }

    /**
     * Display the specified resource.
     */
    public function display(Finding $finding)
    {
        Gate::authorize('view', $finding);

        $finding->load([
            'clause',
            'status',
            'priority',
            'causeCode',
            'department',
            'equipment',
            'functionalLocation',
            'inspector',
            'verifier',
            'rectifier',
            'images',
        ]);

        return Inertia::render("finding/{$this->map[$this->getTypeCode()]}/show", [
            'finding' => new FindingResource($finding),
            'type' => $this->getTypeCode(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function revise(Finding $finding)
    {
        Gate::authorize('edit_finding');

        $finding->load([
            'clause',
            'status',
            'priority',
            'causeCode',
            'department',
            'equipment',
            'functionalLocation',
            'inspector',
            'verifier',
            'images',
        ]);

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $causeCodes = CauseCode::all();
        $departments = Department::all();

        return Inertia::render("finding/{$this->map[$this->getTypeCode()]}/edit", [
            'finding' => new FindingResource($finding),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'causeCodes' => CauseCodeResource::collection($causeCodes),
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Mark finding as closed.
     */
    public function finish(Request $request, Finding $finding)
    {
        Gate::authorize('close', $finding);
        Gate::authorize('close_finding');

        $statusClosed = FindingStatus::where('name', 'Closed')->firstOrFail();

        if ($finding->images()->where('category', 'after')->count() === 0) {
            return back()->with('message', [
                'type' => 'error',
                'description' => 'Cannot close finding: Please upload "After" photos first as evidence of resolution.',
            ]);
        }

        DB::transaction(function () use ($request, $finding, $statusClosed) {
            $finding->update([
                'finding_status_id' => $statusClosed->id,
                'closed_at' => now(),
                'verified_by' => $request->user()->id,
            ]);
        });

        return back()->with('message', [
            'type' => 'success',
            'description' => "Finding {$finding->id} has been marked as Closed.",
        ]);
    }


    protected function performUpdate(Request $request, Finding $finding, array $additionalData = [])
    {
        // 1. Validasi Limit Foto (Cek existing + new)
        $newPhotosCount = $request->hasFile('images') ? count($request->file('images')) : 0;
        $existingPhotosCount = $finding->images()->where('category', 'after')->count();

        if (($existingPhotosCount + $newPhotosCount) > 5) {
            throw new \Exception('Number of photos exceeds the maximum limit (5).');
        }

        return DB::transaction(function () use ($request, $finding, $additionalData) {
            $validated = array_merge($request->validated(), $additionalData);

            // 2. Logic Status: Closed vs Others
            $status = FindingStatus::findOrFail($validated['finding_status_id']);

            if (strtolower($status->name) === 'closed') {
                $validated['verified_by'] = auth()->id();
                $validated['closed_at'] = now();
            } else {
                // Jika teknisi mengisi perbaikan tapi status belum Closed
                $validated['verified_by'] = null;
                $validated['closed_at'] = null;

                if ($request->filled('rectification_action')) {
                    $validated['rectified_by'] = auth()->id();
                }
            }

            $finding->update($validated);

            // 3. Image Upload Handling
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store("images/findings/{$finding->id}", 'public');

                    $finding->images()->create([
                        'file_path'     => $path,
                        'category'      => 'after',
                        'original_name' => $image->getClientOriginalName(),
                    ]);
                }
            }

            return $finding;
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Finding $finding)
    {
        Gate::authorize('delete_finding');

        return DB::transaction(function () use ($finding) {
            $directoryPath = 'images/findings/' . $finding->id;

            $finding->images()->delete();
            $finding->delete();

            if (Storage::disk('public')->exists($directoryPath)) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }
        });
    }
}
