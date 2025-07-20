<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentClass\StoreEquipmentClassRequest;
use App\Http\Requests\EquipmentClass\UpdateEquipmentClassRequest;
use App\Http\Resources\EquipmentClassResource;
use App\Models\EquipmentClass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

use function PHPUnit\Framework\isEmpty;

class EquipmentClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('read_equipmentclass');

        $equipmentClasses = EquipmentClass::search($request)->paginate()->withQueryString();

        return Inertia::render('equipment-class/index', [
            'equipmentClasses' => EquipmentClassResource::collection($equipmentClasses),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        Gate::authorize('create_equipmentclass');

        return Inertia::render('equipment-class/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentClassRequest $request)
    {
        Gate::authorize('create_equipmentclass');

        try {
            EquipmentClass::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating equipment class',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(EquipmentClass $equipmentClass)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EquipmentClass $equipmentClass)
    {
        Gate::authorize('update_equipmentclass');

        return Inertia::render('equipment-class/edit', [
            'equipmentClass' => new EquipmentClassResource($equipmentClass),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentClassRequest $request, EquipmentClass $equipmentClass)
    {
        Gate::authorize('update_equipmentclass');

        try {
            $equipmentClass->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating equipment class',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentClass $equipmentClass)
    {
        Gate::authorize('delete_equipmentclass');

        try {
            if (count($equipmentClass->equipments) > 0) {
                return back()->with('message', [
                    'type' => 'error',
                    'description' => 'Equipment class cannot deleted when related to Equipment',
                ]);
            } else {
                $equipmentClass->delete();

                return back()->with('message', [
                    'type' => 'success',
                    'description' => 'Equipment class deleted successfully',
                ]);
            }
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Equipment class is not found',
            ]);
        }
    }
}
