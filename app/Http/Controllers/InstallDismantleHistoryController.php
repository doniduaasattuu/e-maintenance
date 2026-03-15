<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InstallDismantleHistoryResource;
use App\Models\Equipment;
use App\Models\InstallDismantleHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class InstallDismantleHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_installdismantlehistory');

        $histories = InstallDismantleHistory::search($request)
            ->with(['equipment', 'equipment.eclass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
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
        // Gate::authorize('create_installdismantlehistory');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Gate::authorize('store_installdismantlehistory');
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment)
    {
        Gate::authorize('show_installdismantlehistory');

        $histories = InstallDismantleHistory::with(['equipment', 'equipment.eclass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
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
        // Gate::authorize('edit_installdismantlehistory');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, InstallDismantleHistory $installDismantleHistory)
    {
        // Gate::authorize('update_installdismantlehistory');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InstallDismantleHistory $installDismantleHistory)
    {
        // Gate::authorize('delete_installdismantlehistory');
    }
}
