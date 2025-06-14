<?php

namespace App\Http\Controllers;

use App\Http\Requests\Division\StoreDivisionRequest;
use App\Http\Requests\Division\UpdateDivisionRequest;
use App\Http\Resources\DivisionResource;
use App\Models\Division;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class DivisionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_division');

        $divisions = Division::search($request)->paginate()->withQueryString();

        return Inertia::render('division/index', [
            'divisions' => DivisionResource::collection($divisions),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_division');

        return Inertia::render('division/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreDivisionRequest $request)
    {
        Gate::authorize('create_division');

        $validated = $request->validated();

        Division::create([
            'code' => $validated['code'],
            'name' => $validated['name'],
        ]);

        return redirect()->route('divisions.index')->with('message', [
            'type' => 'success',
            'description' => 'Division created successfully',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Division $division)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Division $division)
    {
        Gate::authorize('update_division');

        return Inertia::render('division/edit', [
            'division' => new DivisionResource($division),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateDivisionRequest $request, Division $division)
    {
        Gate::authorize('update_division');

        try {
            $validated = $request->validated();

            $division->update([
                'name' => $validated['name'],
                'code' => $validated['code'],
            ]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Division updated successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating division',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Division $division)
    {
        Gate::authorize('delete_division');

        $division->delete();

        return redirect()->route('divisions.index')->with('message', [
            'type' => 'success',
            'description' => 'Division deleted successfully',
        ]);
    }
}
