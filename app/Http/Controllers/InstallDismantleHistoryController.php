<?php

namespace App\Http\Controllers;

use App\Exports\InstallDismantleHistoryExport;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InstallDismantleHistoryResource;
use App\Models\Equipment;
use App\Models\InstallDismantleHistory;
use App\Traits\HasPerPagePreference;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class InstallDismantleHistoryController extends Controller
{
    use HasPerPagePreference;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_installdismantlehistory');

        $perPage = $this->getPerPage($request);

        $histories = InstallDismantleHistory::search($request)
            ->with(['equipment', 'equipment.eclass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
            ->orderBy('changed_at', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('install-dismantle/index', [
            'histories' => InstallDismantleHistoryResource::collection($histories),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
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
    public function show(Request $request, Equipment $equipment)
    {
        Gate::authorize('show_installdismantlehistory');

        $perPage = $this->getPerPage($request);

        $histories = InstallDismantleHistory::with(['equipment', 'equipment.eclass', 'fromStatus', 'toStatus', 'toStatus', 'fromFunctionalLocation', 'toFunctionalLocation', 'changedBy'])
            ->where('equipment_id', $equipment->id)
            ->orderBy('changed_at', 'DESC')
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('equipment/history', [
            'equipment' => new EquipmentResource($equipment->load('status')),
            'histories' => InstallDismantleHistoryResource::collection($histories),
            'filters' => [
                'query' => $request->query('query'),
                'per_page' => (string) $perPage,
            ],
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

    public function export(Request $request)
    {
        $filters = [
            'start_date'             => $request->query('start_date'),
            'end_date'               => $request->query('end_date'),
            'functional_location_id' => $request->query('functional_location_id'),
            'equipment_id'           => $request->query('equipment_id'),
        ];

        return Excel::download(new InstallDismantleHistoryExport($filters), 'Install_Dismantle_Histories_' . now()->format('Ymd_His') . '.xlsx');
    }
}
