<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Models\Equipment;
use App\Models\EquipmentInspectionForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EquipmentInspectionFormController extends Controller
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
    public function create(Equipment $equipment)
    {
        Gate::authorize('create_inspection');

        $equipment->load('equipmentClass');
        $class = $equipment->equipmentClass->formable_type;

        switch ($class) {
            case "MOTOR":
                return Inertia::render('inspection/motor/create', [
                    'equipment' => new EquipmentResource($equipment),
                ]);
                break;
            case "PANEL":
                return Inertia::render('inspection/panel/create', [
                    'equipment' => new EquipmentResource($equipment),
                ]);
                break;
            case "TRANSFORMER":
                return Inertia::render('inspection/transformer/create', [
                    'equipment' => new EquipmentResource($equipment),
                ]);
                break;
            case "AC":
                return Inertia::render('inspection/air-conditioner/create', [
                    'equipment' => new EquipmentResource($equipment),
                ]);
                break;
            default:
                return back()->with('message', [
                    'type' => 'error',
                    'description' => 'Equipment class is not exists',
                ]);
                break;
        }
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
    public function show(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentInspectionForm $equipmentInspectionForm)
    {
        //
    }
}
