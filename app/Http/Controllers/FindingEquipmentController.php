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

        $findings = $equipment->findings()
            ->with([
                'clause',
                'status',
                'priority',
                'causeCode',
                'inspector',
                'verifier',
            ])
            ->latest()
            ->paginate(10);

        return Inertia::render('equipment/findings', [
            'equipment' => new EquipmentResource($equipment),
            'findings' => FindingResource::collection($findings),
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
