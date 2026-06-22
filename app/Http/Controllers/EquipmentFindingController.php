<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\FindingResource;
use App\Models\Equipment;
use App\Traits\HasPerPagePreference;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentFindingController extends Controller
{
    use HasPerPagePreference;

    public function show(Request $request, Equipment $equipment)
    {
        $perPage = $this->getPerPage($request);

        return Inertia::render('equipment/findings', [
            'equipment' => new EquipmentResource($equipment->load('status')),
            'findings' => FindingResource::collection(
                $equipment->findings()
                    ->withAllRelations()
                    ->latest()
                    ->search($request)
                    ->paginate($perPage)
                    ->withQueryString()
            ),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
                'start_date' => $request->query('start_date') ?? Carbon::now()->subMonths(3)->format('Y-m-d'),
                'end_date' => $request->query('end_date') ?? Carbon::now()->format('Y-m-d'),
            ],
        ]);
    }
}
