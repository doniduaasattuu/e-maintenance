<?php

namespace App\Http\Controllers;

use App\Http\Requests\FunctionalLocation\StoreFunctionalLocationRequest;
use App\Http\Requests\FunctionalLocation\UpdateFunctionalLocationRequest;
use App\Http\Resources\FunctionalLocationResource;
use App\Http\Resources\WorkCenterResource;
use App\Models\FunctionalLocation;
use App\Models\WorkCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class FunctionalLocationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_functionallocation');

        $functionalLocations = FunctionalLocation::search($request)->paginate()->withQueryString();

        return Inertia::render('functional-location/index', [
            'functionalLocations' => FunctionalLocationResource::collection($functionalLocations),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_functionallocation');

        return Inertia::render('functional-location/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFunctionalLocationRequest $request)
    {
        Gate::authorize('create_functionallocation');

        $validated = $request->validated();

        FunctionalLocation::create($validated);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(FunctionalLocation $functionalLocation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('update_functionallocation');

        return Inertia::render('functional-location/edit', [
            'functionalLocation' => new FunctionalLocationResource($functionalLocation),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFunctionalLocationRequest $request, FunctionalLocation $functionalLocation)
    {
        Gate::authorize('update_functionallocation');

        $validated = $request->validated();

        $functionalLocation->update([
            'code' => $validated['code'],
            'description' => $validated['description'],
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FunctionalLocation $functionalLocation)
    {
        Gate::authorize('delete_functionallocation');

        try {
            $functionalLocation->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Functional location deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Functional location is not found',
            ]);
        }
    }
}
