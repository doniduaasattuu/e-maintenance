<?php

namespace App\Http\Controllers;

use App\Exports\EquipmentMaterialExport;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\MaterialResource;
use App\Models\Equipment;
use App\Models\Material;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EquipmentMaterialController extends Controller
{
    use HasPerPagePreference;

    public function show(Request $request, Equipment $equipment)
    {
        $perPage = $this->getPerPage($request);

        $materials = $equipment
            ->materials()
            ->latest()
            ->paginate($perPage);

        return Inertia::render('equipment/materials', [
            'equipment' => new EquipmentResource($equipment->load('status')),
            'materials' => MaterialResource::collection($materials),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'material_id' => 'required|exists:materials,id',
            'quantity' => 'required|numeric|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        $equipment->materials()->syncWithoutDetaching([
            $validated['material_id'] => [
                'quantity' => $validated['quantity'],
                'note' => $validated['note']
            ]
        ]);

        return back()->with('message', [
            'type' => 'success',
            'description' => 'Material added to equipment successfully.',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Equipment $equipment, Material $material)
    {
        $validated = $request->validate([
            'quantity' => 'required|numeric|min:1',
            'note' => 'nullable|string|max:255',
        ]);

        // Update data di tabel pivot
        $equipment->materials()->updateExistingPivot($material->id, [
            'quantity' => $validated['quantity'],
            'note' => $validated['note']
        ]);

        return back()->with('message', [
            'type' => 'success',
            'description' => 'Material quantity updated.',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment, Material $material)
    {
        $equipment->materials()->detach($material->id);

        return back()->with('message', [
            'type' => 'success',
            'description' => 'Material removed from equipment.',
        ]);
    }

    public function export(Equipment $equipment)
    {
        return Excel::download(new EquipmentMaterialExport($equipment), "Materials_of_" . $equipment->code . '_' . now()->format('Ymd_His') . '.xlsx');
    }
}
