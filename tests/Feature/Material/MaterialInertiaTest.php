<?php

use App\Models\Material;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Material']);

    $this->seed(MaterialUnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
    $this->seed(MaterialSeeder::class);
});

test('material index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('materials.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material/index')
                ->has('materials.data', 10)

        );

    $this->actingAs($admin)
        ->get(route('materials.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material/index')
                ->has('materials.data', 10)
        );
});

test('material create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('materials.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material/create')
                ->has('materialUnits')
                ->has('materialTypes')
        );
});

test('material edit form should be rendered', function () {
    $admin = createAdminUser();
    $material = Material::factory()->create();

    $this->actingAs($admin)
        ->get(route('materials.edit', $material->id))
        ->assertInertia(
            fn($page) => $page
                ->component('material/edit')
                ->has('material.data')
                ->has('material.data.id')
                ->has('material.data.code')
                ->has('material.data.name')
                ->has('material.data.price')
                ->has('material.data.material_unit_id')
                ->has('material.data.material_type_id')
        );
});
