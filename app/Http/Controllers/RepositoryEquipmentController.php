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
        $extensions = Repository::distinct()->pluck('extension');
        $repositories = $equipment->repositories()->paginate(10);

        return Inertia::render('equipment/repositories', [
            'equipment' => new EquipmentResource($equipment),
            'repositories' => RepositoryResource::collection($repositories),
            'extensions' => $extensions,
            'renderable' => config('repository.renderable')
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
