<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentImage\StoreEquipmentImageRequest;
use App\Http\Resources\EquipmentResource;
use App\Models\Equipment;
use App\Models\EquipmentImage;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Ramsey\Uuid\Uuid;
use Inertia\Inertia;

class EquipmentImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Equipment $equipment)
    {
        Gate::authorize('read_equipmentimage');

        return Inertia::render('equipment/image/index', [
            'equipment' => new EquipmentResource($equipment->load('images')),
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
    public function store(StoreEquipmentImageRequest $request)
    {
        // Gate::authorize('create_equipmentimage');

        // $equipment = Equipment::findOrFail($request->equipment);

        // $imagePath = $request->file(('image'))->store('assets/images/equipment', 'public');

        // $image = Image::create([
        //     'path' => 'storage/' . $imagePath,
        // ]);

        // $equipment->images()->attach($image->id);
        // return back();
        Gate::authorize('create_equipmentimage');

        $equipment = Equipment::findOrFail($request->equipment);

        // Store the file in 'public/assets/images/equipment'
        $imagePath = $request->file('image')->store('assets/images/equipment', 'public');

        // Save only relative path in DB
        $image = Image::create([
            'path' => $imagePath,
        ]);

        // Attach relation in pivot table
        $equipment->images()->attach($image->id);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request)
    {
        Gate::authorize('update_equipmentimage');

        $equipment = Equipment::findOrFail($request->equipment);

        return Inertia::render('equipment/image/edit', [
            'equipment' => new EquipmentResource($equipment->load('images')),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update()
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment, Image $image)
    {
        Gate::authorize('delete_equipmentimage');

        $equipment->images()->detach($image->id);

        if ($image->equipments()->count() === 0) {
            Storage::disk('public')->delete($image->path);
            $image->delete();
        }
    }
}
