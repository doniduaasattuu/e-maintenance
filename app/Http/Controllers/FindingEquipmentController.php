<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FindingResource;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FindingEquipmentController extends Controller
{
    //    public function store(Repository $repository, Equipment $equipment)
    //     {
    //         try {
    //             $repository->equipments()->syncWithoutDetaching([$equipment->id]);

    //             return back()->with('message', [
    //                 'type' => 'success',
    //                 'description' => 'Equipment ' . $equipment->code .  ' attached successfully',
    //             ]);
    //         } catch (Throwable $e) {
    //             return back()->with('message', [
    //                 'type' => 'error',
    //                 'description' => $e->getMessage() ?? 'Error attaching equipment',
    //             ]);
    //         }
    //     }

    public function show(Request $request, Equipment $equipment)
    {
        return Inertia::render('equipment/findings', [
            'equipment' => new EquipmentResource($equipment),
            'findings' => FindingResource::collection($equipment->findings()
                ->withDefaultRelations()
                ->latest()
                ->paginate(10)),
        ]);
    }

    // public function destroy(Repository $repository, Equipment $equipment)
    // {
    //     try {
    //         $repository->equipments()->detach($equipment->id);

    //         return back()->with('message', [
    //             'type' => 'success',
    //             'description' => 'Equipment ' . $equipment->code .  ' detached successfully',
    //         ]);
    //     } catch (Throwable $e) {
    //         return back()->with('message', [
    //             'type' => 'error',
    //             'description' => $e->getMessage() ?? 'Failed detaching equipment',
    //         ]);
    //     }
    // }
}
