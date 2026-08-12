<?php

namespace App\Http\Controllers;

use App\Http\Requests\Improvement\StoreImprovementRequest;
use App\Http\Requests\Improvement\UpdateImprovementRequest;
use App\Http\Resources\DepartmentResource;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FunctionalLocationResource;
use App\Http\Resources\ImprovementCategoryResource;
use App\Http\Resources\ImprovementResource;
use App\Http\Resources\ImprovementStatusResource;
use App\Models\Department;
use App\Models\Equipment;
use App\Models\FunctionalLocation;
use App\Models\Improvement;
use App\Models\ImprovementCategory;
use App\Models\ImprovementStatus;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class ImprovementController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Improvement::class);

        $perPage = $this->getPerPage($request);

        $improvements = Improvement::withAllRelations()
            ->when($request->start_date && $request->end_date, function ($query) use ($request) {
                $query->whereBetween('created_at', [
                    $request->start_date . ' 00:00:00',
                    $request->end_date . ' 23:59:59'
                ]);
            })
            ->search($request)
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('improvement/index', [
            'improvements' => ImprovementResource::collection($improvements),
            'improvementCategories' => ImprovementCategoryResource::collection(ImprovementCategory::all()),
            'improvementStatuses' => ImprovementStatusResource::collection(ImprovementStatus::all()),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        Gate::authorize('create', Improvement::class);

        return Inertia::render('improvement/create', [
            'departments' => DepartmentResource::collection(Department::all()),
            'improvementCategories' => ImprovementCategoryResource::collection(ImprovementCategory::all()),
            'improvementStatuses' => ImprovementStatusResource::collection(ImprovementStatus::all()),
            'selectedDepartment' => (string) $request->user()->department_id,
            'selectedCategory' => (string) ImprovementCategory::where('name', 'Electrical')->value('id') ?? '',
            'selectedStatus' => (string) ImprovementStatus::where('name', 'Submitted')->value('id') ?? '',
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImprovementRequest $request)
    {
        Gate::authorize('store_improvement');

        $storedPaths = [];

        try {
            $validated = $request->validated();

            $beforeImages = $validated['images_before'] ?? [];
            $afterImages = $validated['images_after'] ?? [];

            unset(
                $validated['images_before'],
                $validated['images_after']
            );

            $submittedStatus = ImprovementStatus::query()
                ->where('name', 'Submitted')
                ->firstOrFail();

            DB::transaction(function () use (
                $validated,
                $beforeImages,
                $afterImages,
                $submittedStatus,
                $request,
                &$storedPaths
            ) {
                /*
             * Generate improvement code
             */
                $year = now()->format('Y');

                $lastImprovement = Improvement::query()
                    ->where('code', 'like', "IMP-{$year}-%")
                    ->latest('id')
                    ->first();

                $sequence = $lastImprovement
                    ? ((int) substr($lastImprovement->code, -5)) + 1
                    : 1;

                $code = sprintf(
                    'IMP-%s-%05d',
                    $year,
                    $sequence
                );

                /*
             * Create improvement
             */
                $improvement = Improvement::create([
                    ...$validated,

                    'code' => $code,
                    'improvement_status_id' => $submittedStatus->id,
                    'created_by' => $request->user()->id,
                ]);

                /*
             * Store BEFORE images
             */
                foreach ($beforeImages as $image) {
                    $path = $image->store(
                        "improvements/{$improvement->id}/before",
                        'public'
                    );

                    $storedPaths[] = $path;

                    $improvement->images()->create([
                        'file_path' => $path,
                        'category' => 'before',
                        'original_name' => $image->getClientOriginalName(),
                    ]);
                }

                /*
             * Store AFTER images
             */
                foreach ($afterImages as $image) {
                    $path = $image->store(
                        "improvements/{$improvement->id}/after",
                        'public'
                    );

                    $storedPaths[] = $path;

                    $improvement->images()->create([
                        'file_path' => $path,
                        'category' => 'after',
                        'original_name' => $image->getClientOriginalName(),
                    ]);
                }
            });

            return redirect(route('improvements.index'))->with('message', [
                'type' => 'success',
                'description' => 'Improvement created successfully',
            ]);
        } catch (Throwable $e) {
            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage()
                    ?? 'Failed creating improvement',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(int $id)
    {
        Gate::authorize('show_improvement');

        $improvement = Improvement::query()
            ->withAllRelations()
            ->findOrFail($id);

        return Inertia::render('improvement/show', [
            'improvement' => new ImprovementResource($improvement),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Improvement $improvement)
    {
        Gate::authorize('update', $improvement);

        $improvement->load([
            'functionalLocation',
            'equipment',
            'department',
            'category',
            'status',
        ]);

        return Inertia::render('improvement/edit', [
            'improvement' => new ImprovementResource($improvement),
            'departments' => DepartmentResource::collection(Department::all()),
            'improvementCategories' => ImprovementCategoryResource::collection(ImprovementCategory::all()),
            'improvementStatuses' => ImprovementStatusResource::collection(ImprovementStatus::all()),
            'selectedFunctionalLocation' => new FunctionalLocationResource(FunctionalLocation::find($improvement->functional_location_id)),
            'selectedEquipment' => $improvement->equipment_id ? new EquipmentResource(Equipment::find($improvement->equipment_id)) : null,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImprovementRequest $request, Improvement $improvement)
    {
        Gate::authorize('update', $improvement);

        $storedPaths = [];

        try {
            DB::transaction(function () use (
                $request,
                $improvement,
                &$storedPaths
            ) {
                /*
             * Update improvement data.
             */
                $data = $request->safe()->except([
                    'images_before',
                    'images_after',
                ]);

                $improvement->update($data);

                /*
             * Store Before Images
             */
                if ($request->hasFile('images_before')) {
                    foreach ($request->file('images_before') as $image) {
                        $path = $image->store(
                            "improvements/{$improvement->id}/before",
                            'public'
                        );

                        $storedPaths[] = $path;

                        $improvement->images()->create([
                            'file_path' => $path,
                            'category' => 'before',
                            'original_name' => $image->getClientOriginalName(),
                        ]);
                    }
                }

                /*
             * Store After Images
             */
                if ($request->hasFile('images_after')) {
                    foreach ($request->file('images_after') as $image) {
                        $path = $image->store(
                            "improvements/{$improvement->id}/after",
                            'public'
                        );

                        $storedPaths[] = $path;

                        $improvement->images()->create([
                            'file_path' => $path,
                            'category' => 'after',
                            'original_name' => $image->getClientOriginalName(),
                        ]);
                    }
                }
            });

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement updated successfully.',
            ]);
        } catch (Throwable $e) {
            /*
         * Remove files that were already stored if
         * the database transaction failed.
         */
            foreach ($storedPaths as $path) {
                Storage::disk('public')->delete($path);
            }

            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating improvement',
            ]);
        }
    }

    /**
     * Mark improvement status as Implemented.
     */
    public function submit(Improvement $improvement)
    {
        Gate::authorize('submit', $improvement);

        try {
            $status = ImprovementStatus::query()
                ->where('name', 'Submitted')
                ->firstOrFail();

            $improvement->update([
                'improvement_status_id' => $status->id,
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement marked as submitted successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark improvement status as Implemented.
     */
    public function implement(Improvement $improvement)
    {
        Gate::authorize('implement', $improvement);

        try {
            $status = ImprovementStatus::query()
                ->where('name', 'Implemented')
                ->firstOrFail();

            $improvement->update([
                'improvement_status_id' => $status->id,
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement marked as implemented successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark improvement status as Approved.
     */
    public function approve(Improvement $improvement)
    {
        Gate::authorize('approve', $improvement);

        try {
            $status = ImprovementStatus::query()
                ->where('name', 'Approved')
                ->firstOrFail();

            $improvement->update([
                'improvement_status_id' => $status->id,
                'approved_by' => auth()->user()->id,
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement marked as approved successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark improvement status as Verified.
     */
    public function verify(Improvement $improvement)
    {
        Gate::authorize('verify', $improvement);

        try {
            $status = ImprovementStatus::query()
                ->where('name', 'Verified')
                ->firstOrFail();

            $improvement->update([
                'improvement_status_id' => $status->id,
                'verified_by' => auth()->user()->id,
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement marked as verified successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    public function reject(Improvement $improvement)
    {
        Gate::authorize('reject', $improvement);

        try {
            $status = ImprovementStatus::query()
                ->where('name', 'Rejected')
                ->firstOrFail();

            $improvement->update([
                'improvement_status_id' => $status->id,
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement marked as rejected successfully.',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Improvement $improvement)
    {
        Gate::authorize('delete', $improvement);

        try {
            $improvement->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Improvement is not found',
            ]);
        }
    }
}
