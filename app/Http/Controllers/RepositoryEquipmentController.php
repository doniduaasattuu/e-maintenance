<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\RepositoryResource;
use App\Models\Equipment;
use App\Models\Repository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class RepositoryEquipmentController extends Controller
{
    public function store(Repository $repository, Equipment $equipment)
    {
        try {
            $repository->equipments()->syncWithoutDetaching([$equipment->id]);

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

    public function show(Request $request, Equipment $equipment)
    {
        $perPage = $request->input('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100, 250])) {
            $perPage = 10;
        }
        $repositories = $equipment->repositories()->paginate($perPage);

        return Inertia::render('equipment/repositories', [
            'equipment' => new EquipmentResource($equipment),
            'repositories' => RepositoryResource::collection($repositories),
            'filters' => $request->only(['query', 'per_page']),
        ]);
    }

    public function destroy(Repository $repository, Equipment $equipment)
    {
        try {
            $repository->equipments()->detach($equipment->id);

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
