<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InstallDismantleHistoryResource;
use App\Models\Equipment;
use App\Models\InstallDismantleHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InstallDismantleHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $histories = InstallDismantleHistory::search($request)
            ->with(['equipment', 'equipment.equipmentClass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
            ->orderBy('changed_at', 'DESC')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('install-dismantle/index', [
            'histories' => InstallDismantleHistoryResource::collection($histories),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        $histories = InstallDismantleHistory::with(['equipment', 'equipment.equipmentClass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
            ->where('equipment_id', $equipment->id)
            ->orderBy('changed_at', 'DESC')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('equipment/history', [
            'equipment' => new EquipmentResource($equipment),
            'histories' => InstallDismantleHistoryResource::collection($histories),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InstallDismantleHistory $installDismantleHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InstallDismantleHistory $installDismantleHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InstallDismantleHistory $installDismantleHistory)
    {
        //
    }
}
