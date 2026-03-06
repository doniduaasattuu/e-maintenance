<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use App\Http\Requests\Finding\StoreFindingRequest;
use App\Http\Requests\Finding\UpdateFindingRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
use App\Models\Department;
use App\Models\FindingClause;
use App\Models\FindingImage;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class FindingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_finding');

        $findings = Finding::with([
            'clause',
            'status',
            'priority',
            'department',
            'equipment',
            'functionalLocation',
            'inspector',
            'verifier',
            'images',
        ])->orderBy('created_at', 'DESC')->search($request)->paginate(10)->withQueryString();

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();
        $departments = Department::all();

        return Inertia::render('finding/index', [
            'findings' => FindingResource::collection($findings),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
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
        $departments = Department::all();

        return Inertia::render('finding/create', [
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingRequest $request)
    {
        Gate::authorize('store_finding');

        DB::beginTransaction();

        try {
            $validated = $request->validated();
            $validated['inspected_by'] = auth()->id();
            $finding = Finding::create($validated);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = $image->getClientOriginalName();
                    $path = $image->store('images/findings/' . $finding->id, 'public');

                    FindingImage::create([
                        'finding_id'    => $finding->id,
                        'file_path'     => $path,
                        'category'      => 'before',
                        'original_name' => $originalName,
                    ]);
                }
            }

            DB::commit();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding and ' . count($request->file('images')) . ' photos saved successfully.',
            ]);
        } catch (Throwable $e) {
            DB::rollBack();

            if (isset($path)) {
                Storage::disk('public')->deleteDirectory('images/findings/' . $finding->id);
            }

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed creating finding: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Finding $finding)
    {
        Gate::authorize('show_finding');

        $finding->load([
            'clause',
            'status',
            'priority',
            'department',
            'equipment',
            'functionalLocation',
            'inspector',
            'verifier',
            'images',
        ]);

        return Inertia::render('finding/show', [
            'finding' => new FindingResource($finding),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Finding $finding)
    {
        Gate::authorize('edit_finding');

        $finding->load([
            'clause',
            'status',
            'priority',
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
        $departments = Department::all();

        return Inertia::render('finding/edit', [
            'finding' => new FindingResource($finding),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
            'departments' => DepartmentResource::collection($departments),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingRequest $request, Finding $finding)
    {
        Gate::authorize('update_finding');

        DB::beginTransaction();

        try {
            $validated = $request->validated();

            // 1. Logika Kondisional: Verified & Closed Date
            // Kita berasumsi ID status "Closed" bisa dicek dari namanya
            $status = FindingStatus::find($validated['finding_status_id']);

            if (strtolower($status->name) === 'closed') {
                // Hanya tulis jika sebelumnya belum closed atau jika ingin update data verifikator terbaru
                $validated['verified_by'] = auth()->id();
                $validated['closed_at'] = now();
            } else {
                // Jika status dirubah kembali ke Open/Progress, kosongkan data closing
                $validated['verified_by'] = null;
                $validated['closed_at'] = null;
            }

            // 2. Update data Finding
            $finding->update($validated);

            // 3. Penanganan Foto (Jika ada upload baru)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $originalName = $image->getClientOriginalName();

                    // Simpan file ke storage
                    $path = $image->store('images/findings/' . $finding->id, 'public');

                    // Tambahkan record baru ke tabel finding_images
                    FindingImage::create([
                        'finding_id'    => $finding->id,
                        'file_path'     => $path,
                        'category'      => 'after',
                        'original_name' => $originalName,
                    ]);
                }
            }

            DB::commit();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding updated successfully' . ($request->hasFile('images') ? ' with new photos.' : '.'),
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed updating finding: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Finding $finding)
    {
        return redirect(route("findings.index"))->with('message', [
            'type' => 'success',
            'description' => 'Finding deleted successfully',
        ]);
    }
}
