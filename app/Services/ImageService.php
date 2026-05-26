<?php

namespace App\Services;

use App\Http\Requests\Image\StoreImageRequest;
use App\Models\Equipment;
use App\Models\FunctionalLocation;
use App\Models\Image;
use App\Models\Material;
use Illuminate\Support\Facades\Storage;

class ImageService
{
    public function store(StoreImageRequest $request)
    {
        $type = $request->type;
        $id = $request->id;

        switch ($type) {
            case 'functional-location':

                $functionalLocation = FunctionalLocation::findOrFail($id);
                $imagePath = $request->file('image')->store('images/functional-locations/' . $id, 'public');

                Image::create([
                    'path' => $imagePath,
                    'imageable_id' => $functionalLocation->id,
                    'imageable_type' => $type,
                ]);

                break;
            case 'equipment':

                $equipment = Equipment::findOrFail($id);
                $imagePath = $request->file('image')->store('images/equipments/' . $id, 'public');

                Image::create([
                    'path' => $imagePath,
                    'imageable_id' => $equipment->id,
                    'imageable_type' => $type,
                ]);

                break;
            case 'material':
                $material = Material::findOrFail($id);
                $imagePath = $request->file('image')->store('images/materials/' . $id, 'public');

                Image::create([
                    'path' => $imagePath,
                    'imageable_id' => $material->id,
                    'imageable_type' => $type,
                ]);

                break;
            default:
                return back()->with('message', [
                    'type' => 'error',
                    'description' => 'Image type is not exists',
                ]);
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
