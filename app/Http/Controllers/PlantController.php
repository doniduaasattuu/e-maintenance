<?php

namespace App\Http\Controllers;

use App\Http\Requests\Plant\StorePlantRequest;
use App\Http\Requests\Plant\UpdatePlantRequest;
use App\Http\Resources\PlantResource;
use App\Models\Plant;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class PlantController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_plant');

        $perPage = $this->getPerPage($request);
        $query = $request->query('query');
        $plants = Plant::where('name', 'LIKE', "%{$query}%")->paginate($perPage)->withQueryString();

        return Inertia::render('plant/index', [
            'plants' => PlantResource::collection($plants),
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
        Gate::authorize('create_plant');

        return Inertia::render('plant/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlantRequest $request)
    {
        Gate::authorize('store_plant');

        try {
            $validated = $request->validated();

            Plant::create($validated);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating plant',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Plant $plant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Plant $plant)
    {
        Gate::authorize('edit_plant');

        return Inertia::render('plant/edit', [
            'plant' => new PlantResource($plant),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlantRequest $request, Plant $plant)
    {
        Gate::authorize('update_plant');

        try {
            $plant->update($request->validated());
            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating plant',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Plant $plant)
    {
        //
    }
}
