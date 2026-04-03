<?php

namespace App\Http\Controllers;

use App\Http\Requests\FindingType\StoreFindingTypeRequest;
use App\Http\Requests\FindingType\UpdateFindingTypeRequest;
use App\Http\Resources\FindingTypeResource;
use App\Models\FindingType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FindingTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_findingtype');

        $findingTypes = FindingType::search($request)->paginate()->withQueryString();

        return Inertia::render('finding-type/index', [
            'findingTypes' => FindingTypeResource::collection($findingTypes),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_findingtype');

        return Inertia::render('finding-type/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFindingTypeRequest $request)
    {
        Gate::authorize('store_findingtype');

        try {
            FindingType::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating finding type',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(FindingType $findingType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FindingType $findingType)
    {
        Gate::authorize('edit_findingtype');

        return Inertia::render('finding-type/edit', [
            'findingType' => new FindingTypeResource($findingType),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFindingTypeRequest $request, FindingType $findingType)
    {
        Gate::authorize('update_findingtype');

        try {
            $findingType->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating finding type',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FindingType $findingType)
    {
        Gate::authorize('delete_findingtype');

        try {
            $findingType->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Finding type deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Finding type is not found',
            ]);
        }
    }
}
