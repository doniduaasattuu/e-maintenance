<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImprovementStatus\StoreImprovementStatusRequest;
use App\Http\Requests\ImprovementStatus\UpdateImprovementStatusRequest;
use App\Http\Resources\ImprovementStatusResource;
use App\Models\ImprovementStatus;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class ImprovementStatusController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_improvementstatus');

        $perPage = $this->getPerPage($request);

        $improvementStatuses = ImprovementStatus::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('improvement-status/index', [
            'improvementStatuses' => ImprovementStatusResource::collection($improvementStatuses),
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
        Gate::authorize('create_improvementstatus');

        return Inertia::render('improvement-status/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImprovementStatusRequest $request)
    {
        Gate::authorize('store_improvementstatus');

        try {
            ImprovementStatus::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating improvement status',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ImprovementStatus $improvementStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ImprovementStatus $improvementStatus)
    {
        Gate::authorize('edit_improvementstatus');

        return Inertia::render('improvement-status/edit', [
            'improvementStatus' => new ImprovementStatusResource($improvementStatus),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImprovementStatusRequest $request, ImprovementStatus $improvementStatus)
    {
        Gate::authorize('update_improvementstatus');

        try {
            $improvementStatus->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating improvement status',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ImprovementStatus $improvementStatus)
    {
        Gate::authorize('delete_improvementstatus');

        try {
            $improvementStatus->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Improvement status deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Improvement status is not found',
            ]);
        }
    }
}
