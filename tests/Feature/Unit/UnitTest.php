<?php

use App\Models\Unit;
use Database\Seeders\UnitSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_unit']);
    Permission::create(['name' => 'read_unit']);
    Permission::create(['name' => 'update_unit']);
    Permission::create(['name' => 'delete_unit']);

    $this->seed(UnitSeeder::class);
});

test('admin can create unit with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('units.create'))
        ->post(route('units.store'), [
            'name' => 'Mile',
        ])
        ->assertRedirect(route('units.create'));

    $this->assertDatabaseHas('units', ['name' => 'Mile']);
});

test('admin cannot create unit with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post(route('units.store'), [
            'name' => '',
        ])
        ->assertSessionHasErrors(['name']);
});

test('admin cannot create duplicate unit', function () {
    $admin = createAdminUser();
    Unit::create(['name' => 'Mile']);

    $this->actingAs($admin)
        ->from(route('units.create'))
        ->post(route('units.store'), [
            'name' => 'Mile',
        ])
        ->assertSessionHasErrors('name');
});

test('admin can update unit', function () {
    $admin = createAdminUser();
    $unit = Unit::create(['name' => 'Mile']);
    $editPage = route('units.edit', $unit->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->put(route('units.update', $unit->id), [
            'name' => 'Miles',
        ])
        ->assertRedirect($editPage);

    $this->assertDatabaseHas('units', ['name' => 'Miles']);
});

test('admin can delete unit', function () {
    $admin = createAdminUser();
    $unit = Unit::create(['name' => 'Mile']);

    $this->actingAs($admin)
        ->from(route('units.index'))
        ->delete(route('units.destroy', $unit->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Unit deleted successfully',
        ]);
});
