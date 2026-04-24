<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindingClause\StoreFindingClauseRequest;
use App\Http\Requests\FindingClause\UpdateFindingClauseRequest;
use App\Http\Resources\FindingClauseResource;
use App\Http\Resources\FindingTypeResource;
use App\Models\FindingClause;
use App\Models\FindingType;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FindingClauseController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingclause');

        $perPage = $this->getPerPage($request);

        $findingClauses = FindingClause::search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('finding-clause/index', [
            'findingClauses' => FindingClauseResource::collection($findingClauses),
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
        Gate::authorize('create_findingclause');
        $findingTypes = FindingType::get();

        return Inertia::render('finding-clause/create', [
            'findingTypes' => FindingTypeResource::collection($findingTypes),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingClauseRequest $request)
    {
        Gate::authorize('store_findingclause');

        try {
            FindingClause::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating finding clause',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FindingClause $findingClause)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FindingClause $findingClause)
    {
        Gate::authorize('edit_findingclause');
        $findingTypes = FindingType::get();

        return Inertia::render('finding-clause/edit', [
            'findingClause' => new FindingClauseResource($findingClause),
            'findingTypes' => FindingTypeResource::collection($findingTypes),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingClauseRequest $request, FindingClause $findingClause)
    {
        Gate::authorize('update_findingclause');

        try {
            $findingClause->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating finding clause',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FindingClause $findingClause)
    {
        Gate::authorize('delete_findingclause');

        try {
            $findingClause->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding clause deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Finding clause is not found',
            ]);
        }
    }
}
