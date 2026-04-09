<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\MaterialResource;
use App\Models\Equipment;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class MaterialEquipmentController extends Controller
{
    public function store(Material $material, Equipment $equipment)
    {
        try {
            $material->equipments()->syncWithoutDetaching([$equipment->id]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Equipment ' . $equipment->code .  ' attached successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Error attaching equipment',
            ]);
        }
    }

    public function show(Equipment $equipment)
    {
        $materials = $equipment
            ->materials()
            ->withDefaultRelations()
            ->latest()
            ->paginate(10);

        return Inertia::render('equipment/materials', [
            'equipment' => new EquipmentResource($equipment),
            'materials' => MaterialResource::collection($materials),
        ]);
    }

    public function destroy(Material $material, Equipment $equipment)
    {
        try {
            $material->equipments()->detach($equipment->id);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Equipment ' . $equipment->code .  ' detached successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed detaching equipment',
            ]);
        }
    }
}
