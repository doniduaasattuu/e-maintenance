<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquipmentResource;
use App\Http\Resources\MaterialResource;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialRelationController extends Controller
{

    public function index(Material $material)
    {
        $equipments = $material->equipments;

        return Inertia::render('material/relation/index', [
            'material' => new MaterialResource($material),
            'equipments' => EquipmentResource::collection($equipments),
        ]);
    }
}
