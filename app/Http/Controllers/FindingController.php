<?php

namespace App\Http\Controllers;

use App\Models\Finding;
use App\Http\Requests\Finding\StoreFindingRequest;
use App\Http\Requests\Finding\UpdateFindingRequest;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingPriorityResource;
use App\Http\Resources\FindingResource;
use App\Http\Resources\FindingStatusResource;
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
            'findingClause',
            'findingStatus',
            'findingPriority',
            'equipment',
            'functionalLocation',
            'inspectedBy',
            'verifiedBy',
            'images',
        ])->orderBy('created_at', 'DESC')->search($request)->paginate(10)->withQueryString();

        $findingClauses = FindingClause::all();
        $findingStatuses = FindingStatus::all();
        $findingPriorities = FindingPriority::all();

        return Inertia::render('finding/index', [
            'findings' => FindingResource::collection($findings),
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
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

        return Inertia::render('finding/create', [
            'findingClauses' => FindingClauseResource::collection($findingClauses),
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
            'findingPriorities' => FindingPriorityResource::collection($findingPriorities),
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
                    // $extension = $image->getClientOriginalExtension();
                    // $fileName = pathinfo($originalName, PATHINFO_FILENAME) . '_' . time() . '.' . $extension;

                    // $path = $image->storeAs('images/findings', $fileName, 'public');

                    $path = $image->store('images/findings', 'public');


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
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Finding $finding)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingRequest $request, Finding $finding)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Finding $finding)
    {
        //
    }
}
