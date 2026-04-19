<?php

use App\Models\MaterialUnit;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['MaterialUnit']);

    $this->seed(MaterialUnitSeeder::class);
});

test('unit index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('material-units.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-unit/index')
                ->has('materialUnits.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('material-units.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-unit/index')
                ->has('materialUnits.data', 10)
        );
});

test('unit create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('material-units.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('material-unit/create')
        );
});

test('unit edit form should be rendered', function () {
    $admin = createAdminUser();
    $unit = MaterialUnit::orderBy('id', 'ASC')->first();

    $this->actingAs($admin)
        ->get(route('material-units.edit', $unit->id))
        ->assertInertia(
            fn($page) => $page
                ->component('material-unit/edit')
                ->has('materialUnit.data')
                ->has('materialUnit.data.id')
                ->has('materialUnit.data.name')
        );
});

test('unit edit admin form should be rendered', function () {
    $admin = createAdminUser();
    $unit = MaterialUnit::first();

    $this->actingAs($admin)
        ->get(route('material-units.edit', $unit->id))
        ->assertStatus(200);
});

test('unit should can be deleted', function () {
    $admin = createAdminUser();
    $unit = MaterialUnit::first();

    $this->actingAs($admin)
        ->delete(route('material-units.destroy', $unit->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Unit deleted successfully',
        ]);
});
