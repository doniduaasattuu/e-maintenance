<?php

namespace App\Http\Controllers;

use App\Http\Resources\MaterialResource;
use App\Http\Resources\RepositoryResource;
use App\Models\Material;
use App\Models\Repository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class RepositoryMaterialController extends Controller
{
    public function store(Repository $repository, Material $material)
    {
        try {
            $repository->materials()->syncWithoutDetaching([$material->id]);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Material ' . $material->code .  ' attached successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Error attaching material',
            ]);
        }
    }


    public function show(Request $request, Material $material)
    {
        $extensions = Repository::distinct()->pluck('extension');
        $repositories = $material->repositories()->paginate(15);

        return Inertia::render('material/repositories', [
            'material' => new MaterialResource($material),
            'repositories' => RepositoryResource::collection($repositories),
            'extensions' => $extensions,
            'renderable' => config('repository.renderable')
        ]);
    }

    public function destroy(Repository $repository, Material $material)
    {
        try {
            $repository->materials()->detach($material->id);

            return back()->with('message', [
                'type' => 'success',
                'description' => 'Material ' . $material->code .  ' detached successfully',
            ]);
        } catch (Throwable $e) {
            return back()->with('message', [
                'type' => 'error',
                'description' => $e->getMessage() ?? 'Failed detaching material',
            ]);
        }
    }
}
