<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindingClause\StoreFindingClauseRequest;
use App\Http\Requests\FindingClause\UpdateFindingClauseRequest;
use App\Http\Resources\FindingClauseResource;
use App\Models\FindingClause;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FindingClauseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingclause');

        $findingClauses = FindingClause::search($request)->paginate()->withQueryString();

        return Inertia::render('finding-clause/index', [
            'findingClauses' => FindingClauseResource::collection($findingClauses),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_findingclause');

        return Inertia::render('finding-clause/create');
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

        return Inertia::render('finding-clause/edit', [
            'findingClause' => new FindingClauseResource($findingClause),
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
        //
    }
}
