<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindingStatus\StoreFindingStatusRequest;
use App\Http\Requests\FindingStatus\UpdateFindingStatusRequest;
use App\Http\Resources\FindingStatusResource;
use App\Models\FindingStatus;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FindingStatusController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingstatus');

        $perPage = $this->getPerPage($request);

        $findingStatuses = FindingStatus::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('finding-status/index', [
            'findingStatuses' => FindingStatusResource::collection($findingStatuses),
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
        Gate::authorize('create_findingstatus');

        return Inertia::render('finding-status/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingStatusRequest $request)
    {
        Gate::authorize('store_findingstatus');

        try {
            FindingStatus::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating finding status',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FindingStatus $findingStatus)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FindingStatus $findingStatus)
    {
        Gate::authorize('edit_findingstatus');

        return Inertia::render('finding-status/edit', [
            'findingStatus' => new FindingStatusResource($findingStatus),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingStatusRequest $request, FindingStatus $findingStatus)
    {
        Gate::authorize('update_findingstatus');

        try {
            $findingStatus->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating finding status',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FindingStatus $findingStatus)
    {
        Gate::authorize('delete_findingstatus');

        try {
            $findingStatus->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding status deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Finding status is not found',
            ]);
        }
    }
}
