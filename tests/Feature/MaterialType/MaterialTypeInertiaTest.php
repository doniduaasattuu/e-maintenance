<?php

use App\Models\MaterialType;
use Database\Seeders\MaterialTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['MaterialType']);

    $this->seed(MaterialTypeSeeder::class);
});

test('material type index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('material-types.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-type/index')
                ->has('materialTypes.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('material-types.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-type/index')
                ->has('materialTypes.data', 2)
        );
});

test('material type create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('material-types.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-type/create'),
        );
});

test('material type edit form should be rendered', function () {
    $admin = createAdminUser();
    $materialtype = MaterialType::first();

    $this->actingAs($admin)
        ->get(route('material-types.edit', $materialtype->id))
        ->assertInertia(
            fn($page) => $page
                ->component('material-type/edit')
                ->has('materialType.data')
                ->has('materialType.data.id')
                ->has('materialType.data.code')
                ->has('materialType.data.description')
        );
});
