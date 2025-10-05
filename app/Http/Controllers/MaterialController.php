<?php

namespace App\Http\Controllers;

use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Http\Resources\MaterialTypeResource;
use App\Http\Resources\UnitResource;
use App\Models\Material;
use App\Models\MaterialType;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_material');

        $materials = Material::with(['unit', 'materialType'])->search($request)->paginate()->withQueryString();

        return Inertia::render('material/index', [
            'materials' => MaterialResource::collection($materials),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_material');

        return Inertia::render('material/create', [
            'units' => UnitResource::collection(Unit::all()),
            'materialTypes' => MaterialTypeResource::collection(MaterialType::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialRequest $request)
    {
        Gate::authorize('create_material');

        try {
            $validated = $request->validated();

            Material::create([
                'code' => $validated['code'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'unit_id' => $validated['unit_id'],
                'material_type_id' => $validated['material_type_id'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating material',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Material $material)
    {
        Gate::authorize('read_material');

        return Inertia::render('material/show', [
            'material' => new MaterialResource($material->load(['unit', 'materialType'])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Material $material)
    {
        Gate::authorize('update_material');

        return Inertia::render('material/edit', [
            'material' => new MaterialResource($material),
            'units' => UnitResource::collection(Unit::all()),
            'materialTypes' => MaterialTypeResource::collection(MaterialType::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialRequest $request, Material $material)
    {
        Gate::authorize('update_material');

        try {
            $validated = $request->validated();

            $material->update([
                'code' => $validated['code'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'unit_id' => $validated['unit_id'],
                'material_type_id' => $validated['material_type_id'],
            ]);

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating material',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Material $material)
    {
        Gate::authorize('delete_material');

        try {
            $material->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Material deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Material is not found',
            ]);
        }
    }
}
