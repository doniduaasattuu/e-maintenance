<?php

use App\Models\Material;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\UnitSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_material']);
    Permission::create(['name' => 'read_material']);
    Permission::create(['name' => 'update_material']);
    Permission::create(['name' => 'delete_material']);

    $this->seed(UnitSeeder::class);
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
                ->has('materials.data', 15)

        );

    $this->actingAs($admin)
        ->get(route('materials.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material/index')
                ->has('materials.data', 15)
        );
});

test('material create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('materials.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material/create')
                ->has('units')
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
                ->has('material.data.unit_id')
                ->has('material.data.material_type_id')
        );
});
