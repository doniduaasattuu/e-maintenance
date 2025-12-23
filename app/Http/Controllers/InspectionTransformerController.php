<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspectionTransformer\StoreInspectionTransformerRequest;
use App\Http\Requests\InspectionTransformer\UpdateInspectionTransformerRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\InspectionTransformerResource;
use App\Models\InspectionTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class InspectionTransformerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Gate::authorize('index_inspectiontransformer');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Gate::authorize('create_inspectiontransformer');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInspectionTransformerRequest $request)
    {
        Gate::authorize('store_inspectiontransformer');
        $validated = $request->validated();

        try {
            DB::transaction(function () use ($validated) {
                $data = Arr::except($validated, ['equipment_id']);

                $inspectionTransformer = InspectionTransformer::create($data);

                $inspectionTransformer->inspectionForm()->create([
                    'equipment_id' => $validated['equipment_id'],
                ]);

                return back()->with('message', [
                    'type' => 'success',
                    'description' => 'Stored successfully',
                    'action' => [
                        'label' => 'Edit',
                        'url' => route('inspectiontransformers.edit', $inspectionTransformer->id),
                        'method' => 'get',
                    ]
                ]);
            });
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed store inspection transformer',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(InspectionTransformer $inspectionTransformer)
    {
        // Gate::authorize('show_inspectiontransformer');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(InspectionTransformer $inspectionTransformer)
    {
        Gate::authorize('edit_inspectiontransformer');
        $inspectionTransformer->load('inspectionForm.equipment');

        return Inertia::render('inspection/transformer/edit', [
            'inspectionTransformer' => new InspectionTransformerResource($inspectionTransformer),
            'equipment' => new EquipmentResource($inspectionTransformer->inspectionForm->equipment),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInspectionTransformerRequest $request, InspectionTransformer $inspectionTransformer)
    {
        Gate::authorize('update_inspectiontransformer');

        $inspectionTransformer->update(Arr::except($request->validated(), ['equipment_id']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(InspectionTransformer $inspectionTransformer)
    {
        // Gate::authorize('delete_inspectiontransformer');
    }
}
