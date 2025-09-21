<?php

use App\Models\Unit;
use Database\Seeders\UnitSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_unit']);
    Permission::create(['name' => 'read_unit']);
    Permission::create(['name' => 'update_unit']);
    Permission::create(['name' => 'delete_unit']);

    $this->seed(UnitSeeder::class);
});

test('unit index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('units.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('unit/index')
                ->has('units.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('units.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('unit/index')
                ->has('units.data', 5)
        );
});

test('unit create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('units.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('unit/create')
        );
});

test('unit edit form should be rendered', function () {
    $admin = createAdminUser();
    $unit = Unit::orderBy('id', 'ASC')->first();

    $this->actingAs($admin)
        ->get(route('units.edit', $unit->id))
        ->assertInertia(
            fn($page) => $page
                ->component('unit/edit')
                ->has('unit.data')
                ->has('unit.data.id')
                ->has('unit.data.name')
        );
});

test('unit edit admin form should be rendered', function () {
    $admin = createAdminUser();
    $unit = Unit::first();

    $this->actingAs($admin)
        ->get(route('units.edit', $unit->id))
        ->assertStatus(200);
});

test('unit should can be deleted', function () {
    $admin = createAdminUser();
    $unit = Unit::first();

    $this->actingAs($admin)
        ->delete(route('units.destroy', $unit->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Unit deleted successfully',
        ]);
});
