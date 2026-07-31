<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentType\StoreEquipmentTypeRequest;
use App\Http\Requests\EquipmentType\UpdateEquipmentTypeRequest;
use App\Models\EquipmentType;
use App\Http\Resources\EquipmentClassResource;
use App\Http\Resources\EquipmentTypeResource;
use App\Models\EquipmentClass;
use App\Traits\HasPerPagePreference;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Throwable;

class EquipmentTypeController extends Controller
{
    use HasPerPagePreference;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('index_equipmenttype');

        $perPage = $this->getPerPage($request);

        $equipmentTypes = EquipmentType::with('equipmentClass')->search($request)->paginate($perPage)->withQueryString();

        return Inertia::render('equipment-type/index', [
            'equipmentTypes' => EquipmentTypeResource::collection($equipmentTypes),
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
        Gate::authorize('create_equipmenttype');

        return Inertia::render('equipment-type/create', [
            'equipmentClasses' => EquipmentClassResource::collection(EquipmentClass::all()),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEquipmentTypeRequest $request)
    {
        Gate::authorize('store_equipmenttype');

        try {
            EquipmentType::create($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed creating equipment type',
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(EquipmentType $equipmentType)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EquipmentType $equipmentType)
    {
        Gate::authorize('edit_equipmenttype');

        return Inertia::render('equipment-type/edit', [
            'equipmentType' => new EquipmentTypeResource($equipmentType),
            'equipmentClasses' => EquipmentClassResource::collection(EquipmentClass::all()),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEquipmentTypeRequest $request, EquipmentType $equipmentType)
    {
        Gate::authorize('update_equipmenttype');

        try {
            $equipmentType->update($request->validated());

            return back();
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed updating equipment type',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentType $equipmentType)
    {
        Gate::authorize('delete_equipmenttype');

        try {
            if (count($equipmentType->equipments) > 0) {
                throw Exception('Equipment type cannot delete');
            }

            $equipmentType->delete();

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Equipment type deleted successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Equipment type is not found',
            ]);
        }
    }
}
