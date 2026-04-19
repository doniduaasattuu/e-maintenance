<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FindingResource;
use App\Models\Equipment;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentFindingController extends Controller
{
    use HasPerPagePreference;

    public function show(Request $request, Equipment $equipment)
    {
        $perPage = $this->getPerPage($request);

        return Inertia::render('equipment/findings', [
            'equipment' => new EquipmentResource($equipment),
            'findings' => FindingResource::collection(
                $equipment->findings()
                    ->withDefaultRelations()
                    ->latest()
                    ->paginate($perPage)
            ),
        ]);
    }
}
