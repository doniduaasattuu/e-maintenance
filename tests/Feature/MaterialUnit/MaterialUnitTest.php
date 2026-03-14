<?php

use App\Models\MaterialUnit;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['MaterialUnit']);

    $this->seed(MaterialUnitSeeder::class);
});

test('admin can create unit with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('material-units.create'))
        ->post(route('material-units.store'), [
            'name' => 'Mile',
        ])
        ->assertRedirect(route('material-units.create'));

    $this->assertDatabaseHas('material_units', ['name' => 'Mile']);
});

test('admin cannot create unit with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post(route('material-units.store'), [
            'name' => '',
        ])
        ->assertSessionHasErrors(['name']);
});

test('admin cannot create duplicate unit', function () {
    $admin = createAdminUser();
    MaterialUnit::create(['name' => 'Mile']);

    $this->actingAs($admin)
        ->from(route('material-units.create'))
        ->post(route('material-units.store'), [
            'name' => 'Mile',
        ])
        ->assertSessionHasErrors('name');
});

test('admin can update unit', function () {
    $admin = createAdminUser();
    $unit = MaterialUnit::create(['name' => 'Mile']);
    $editPage = route('material-units.edit', $unit->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->put(route('material-units.update', $unit->id), [
            'name' => 'Random',
        ])
        ->assertRedirect($editPage);

    $this->assertDatabaseHas('material_units', ['name' => 'Random']);
});

test('admin can delete unit', function () {
    $admin = createAdminUser();
    $unit = MaterialUnit::create(['name' => 'Mile']);

    $this->actingAs($admin)
        ->from(route('material-units.index'))
        ->delete(route('material-units.destroy', $unit->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Unit deleted successfully',
        ]);
});
