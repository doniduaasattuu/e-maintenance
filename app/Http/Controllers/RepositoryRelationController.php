<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\MaterialResource;
use App\Http\Resources\RepositoryResource;
use App\Models\Repository;
use Inertia\Inertia;

class RepositoryRelationController extends Controller
{
    public function index(Repository $repository)
    {
        $equipments = $repository->equipments;
        $materials = $repository->materials;

        return Inertia::render('repository/relation/index', [
            'repository' => new RepositoryResource($repository),
            'equipments' => EquipmentResource::collection($equipments),
            'materials' => MaterialResource::collection($materials),
        ]);
    }
}
