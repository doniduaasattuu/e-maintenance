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
    public function index(string $id, string $type)
    {
        Gate::authorize('index_image');

        switch ($type) {
            case 'equipment':
                $equipment = Equipment::find($id);

                return Inertia::render('equipment/image/index', [
                    'equipment' => new EquipmentResource($equipment->load([
                        'images' => function ($query) {
                            $query->latest();
                        }
                    ])),
                ]);
                break;
            case 'material':
                $material = Material::find($id);

                return Inertia::render('material/image/index', [
                    'material' => new MaterialResource($material->load([
                        'images' => function ($query) {
                            $query->latest();
                        }
                    ])),
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
        // Gate::authorize('create_image');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreImageRequest $request)
    {
        Gate::authorize('store_image');

        $this->imageService->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(Image $image)
    {
        // Gate::authorize('show_image');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        // Gate::authorize('edit_image');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Image $image)
    {
        // Gate::authorize('update_image');
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
