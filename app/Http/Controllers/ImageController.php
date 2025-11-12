<?php

namespace App\Http\Controllers;

use App\Http\Requests\Image\StoreImageRequest;
use App\Http\Resources\EquipmentResource;
use App\Http\Resources\MaterialResource;
use App\Models\Equipment;
use App\Models\Image;
use App\Models\Material;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ImageController extends Controller
{
    private $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(string $model, string $id)
    {
        Gate::authorize('read_image');

        switch ($model) {
            case 'equipment':
                $equipment = Equipment::find($id);

                return Inertia::render('equipment/image/index', [
                    'equipment' => new EquipmentResource($equipment->load('images')),
                ]);
                break;
            case 'material':
                $material = Material::find($id);

                return Inertia::render('material/image/index', [
                    'material' => new MaterialResource($material->load('images')),
                ]);
                break;
            default:
                return back()->with('message', [
                    'type' => 'error',
                    'description' => 'Image model is not exists',
                ]);
                break;
        }
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
    public function store(StoreImageRequest $request)
    {
        Gate::authorize('create_image');

        $this->imageService->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Image $image)
    {
        Gate::authorize('delete_image');

        $this->imageService->destroy($image);

        return back()->with('message', [
            'type' => 'success',
            'description' => 'Image deleted successfully',
        ]);
    }
}
