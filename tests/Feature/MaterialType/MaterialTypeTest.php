<?php

use App\Models\MaterialType;
use Database\Seeders\MaterialTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_materialtype']);
    Permission::create(['name' => 'read_materialtype']);
    Permission::create(['name' => 'update_materialtype']);
    Permission::create(['name' => 'delete_materialtype']);

    $this->seed(MaterialTypeSeeder::class);
});

test('material type index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('material-types.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('material-type/index')
                ->has('materialTypes.data', 15)
        );
});

test('create material type page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('material-types.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('material-type/create')
        );
});

test('store material type successfully', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('material-types.create'))
        ->post(route('material-types.store'), [
            'code' => 'S1',
            'description' => 'Stock minimum',
        ]);

    $response
        ->assertRedirect(route('material-types.create'));

    $materialType = MaterialType::where('code', 'S1')->first();
    expect($materialType)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('material-types.store'), [
            'code' => 'ND',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['code', 'description']);
});

test('edit page accessible', function () {
    $materialType = MaterialType::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('material-types.edit', $materialType->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('material-type/edit')
                ->has('materialType.data')
                ->has('materialType.data.id')
                ->has('materialType.data.code')
                ->has('materialType.data.description')
        );
});

test('update material type successfully', function () {
    $materialType = MaterialType::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('material-types.edit', $materialType->id))
        ->put(route('material-types.update', $materialType->id), [
            'code' => 'FP',
            'description' => 'Stock minimum',
        ])
        ->assertRedirect(route('material-types.edit', $materialType->id));

    $materialType->refresh();
    expect($materialType->code)->toBe('FP');
    expect($materialType->description)->toBe('Stock minimum');
});

test('update material type fails validation', function () {
    $materialType = MaterialType::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('material-types.edit', $materialType->id))
        ->patch(route('material-types.update', $materialType->id), [
            'code' => 'ND',
            'description' => '',
        ])
        ->assertSessionHasErrors(['code', 'description']);
});

test('can delete material type', function () {
    $materialType = MaterialType::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('material-types.index'))
        ->delete(route('material-types.destroy', $materialType->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Material type deleted successfully',
        ]);

    expect(MaterialType::find($materialType->id))->toBeNull();
});
