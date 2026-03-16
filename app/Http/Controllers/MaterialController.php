<?php

namespace App\Http\Controllers;

use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Http\Resources\MaterialTypeResource;
use App\Http\Resources\MaterialUnitResource;
use App\Models\Material;
use App\Models\MaterialType;
use App\Models\MaterialUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Throwable;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_material');

        $materials = Material::with(['unit', 'type'])->search($request)->paginate()->withQueryString();

        if ($request->expectsJson() && $request->filled('query')) {
            return response()->json(MaterialResource::collection($materials));
        }

        return Inertia::render('material/index', [
            'materials' => MaterialResource::collection($materials),
            'materialUnits' => MaterialUnitResource::collection(MaterialUnit::all()),
            'materialTypes' => MaterialTypeResource::collection(MaterialType::all()),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_material');

        return Inertia::render('material/create', [
            'materialUnits' => MaterialUnitResource::collection(MaterialUnit::all()),
            'materialTypes' => MaterialTypeResource::collection(MaterialType::all()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialRequest $request)
    {
        Gate::authorize('store_material');

        try {
            $validated = $request->validated();

            Material::create([
                'code' => $validated['code'],
                'name' => $validated['name'],
                'price' => $validated['price'],
                'material_unit_id' => $validated['material_unit_id'],
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
        Gate::authorize('show_material');

        return Inertia::render('material/show', [
            'material' => new MaterialResource($material->load(['unit', 'type'])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Material $material)
    {
        Gate::authorize('edit_material');

        return Inertia::render('material/edit', [
            'material' => new MaterialResource($material),
            'materialUnits' => MaterialUnitResource::collection(MaterialUnit::all()),
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
                'material_unit_id' => $validated['material_unit_id'],
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

        DB::beginTransaction();

        try {
            $directoryPath = 'images/materials/' . $material->id;

            $material->images()->delete();
            $material->delete();

            if (Storage::disk('public')->exists($directoryPath)) {
                Storage::disk('public')->deleteDirectory($directoryPath);
            }

            DB::commit();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Material deleted successfully',
            ]);
        } catch (Throwable $e) {
            DB::rollBack();

            return back()->with('message', [
                'type' => 'error',
                'description' => 'Failed to delete material: ' . $e->getMessage(),
            ]);
        }
    }
}
