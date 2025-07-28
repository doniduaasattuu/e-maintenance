<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionPanel\StoreInspectionPanelRequest;
use App\Http\Requests\InspectionPanel\UpdateInspectionPanelRequest;
use App\Http\Resources\InspectionPanelResource;
use App\Models\InspectionPanel;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class InspectionPanelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreInspectionPanelRequest $request)
    {
        Gate::authorize('create_inspectionpanel');
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                $data = Arr::except($validated, ['equipment_id']);

                $inspectionPanel = InspectionPanel::create($data);

                $inspectionPanel->inspectionForm()->create([
                    'equipment_id' => $validated['equipment_id'],
                ]);

                return back()->with('message', [
                    'type' => 'success',
                    'description' => 'Stored successfully',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectionpanels.edit', $inspectionPanel->id),
                        'method' => 'get',
                    ]
                ]);
            });
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed store inspection panel',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InspectionPanel $inspectionPanel)
    {
        Gate::authorize('update_inspectionpanel');

        return Inertia::render('inspection/panel/edit', [
            'inspectionPanel' => new InspectionPanelResource($inspectionPanel->load('inspectionForm.equipment')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionPanelRequest $request, InspectionPanel $inspectionPanel)
    {
        Gate::authorize('update_inspectionpanel');

        $inspectionPanel->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
