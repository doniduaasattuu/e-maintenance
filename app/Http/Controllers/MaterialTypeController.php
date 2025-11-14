<?php

namespace App\Http\Controllers;

use App\Http\Requests\MaterialType\StoreMaterialTypeRequest;
use App\Http\Requests\MaterialType\UpdateMaterialTypeRequest;
use App\Http\Resources\MaterialTypeResource;
use App\Models\MaterialType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class MaterialTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_materialtype');

        $material_types = MaterialType::search($request)->paginate()->withQueryString();

        return Inertia::render('material-type/index', [
            'materialTypes' => MaterialTypeResource::collection($material_types),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_materialtype');

        return Inertia::render('material-type/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialTypeRequest $request)
    {
        Gate::authorize('create_materialtype');

        try {
            $validated = $request->validated();

            MaterialType::create([
                'code' => $validated['code'],
                'description' => $validated['description'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating material type',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(MaterialType $materialType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(MaterialType $materialType)
    {
        Gate::authorize('update_materialtype');

        return Inertia::render('material-type/edit', [
            'materialType' => new MaterialTypeResource($materialType),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialTypeRequest $request, MaterialType $materialType)
    {
        Gate::authorize('update_materialtype');

        try {
            $validated = $request->validated();

            $materialType->update([
                'code' => $validated['code'],
                'description' => $validated['description'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating material type',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(MaterialType $materialType)
    {
        Gate::authorize('delete_materialtype');

        try {
            $materialType->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Material type deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Material type is not found',
            ]);
        }
    }
}
