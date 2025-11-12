<?php

namespace App\Services;

use App\Http\Requests\Image\StoreImageRequest;
use App\Models\Equipment;
use App\Models\Image;
use App\Models\Material;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function store(StoreImageRequest $request)
    {
        $model = $request->model;
        $id = $request->id;

        switch ($model) {
            case 'equipment':

                $equipment = Equipment::findOrFail($id);
                $imagePath = $request->file('image')->store('assets/images/' . $model, 'public');

                Image::create([
                    'path' => $imagePath,
                    'imageable_id' => $equipment->id,
                    'imageable_type' => $model,
                ]);

                break;
            case 'material':
                $material = Material::findOrFail($id);
                $imagePath = $request->file('image')->store('assets/images/' . $model, 'public');

                Image::create([
                    'path' => $imagePath,
                    'imageable_id' => $material->id,
                    'imageable_type' => $model,
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

    public function destroy(Image $image)
    {
        if (Storage::disk('public')->exists($image->path)) {
            Storage::disk('public')->delete($image->path);
        }

        $image->delete();
    }
}
