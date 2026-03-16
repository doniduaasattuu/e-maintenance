<?php

use App\Models\Material;
use App\Models\MaterialType;
use App\Models\MaterialUnit;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Material', 'MaterialUnit', 'MaterialType']);

    $this->seed(MaterialUnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
});

test('material index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('materials.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('material/index')
        );
});

test('create material page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('materials.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('material/create')
        );
});

test('store material successfully', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('materials.create'))
        ->post(route('materials.store'), [
            'code' => '10018765',
            'name' => 'New american gospel',
            'price' => 1200000,
            'material_unit_id' => MaterialUnit::first()->id,
            'material_type_id' => MaterialType::first()->id,
        ]);

    $response
        ->assertRedirect(route('materials.create'));

    assertDatabaseHas('materials', ['code' => '10018765']);
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('materials.store'), [
            'code' => '10018765s',
            'name' => '',
            'price' => 's',
            'material_unit_id' => MaterialUnit::factory()->create()->id + 1,
            'material_type_id' => MaterialType::factory()->create()->id + 1,
        ]);

    $response->assertSessionHasErrors([
        'code',
        'name',
        'price',
        'material_unit_id',
        'material_type_id',
    ]);
});

test('edit page accessible', function () {
    $material = Material::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('materials.edit', $material->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('material/edit')
                ->has('material')
                ->has('materialUnits')
                ->has('materialTypes')
        );
});

test('update material successfully', function () {
    $material = Material::factory()->create();

    expect($material)->not()->toBe(null);

    $this
        ->actingAs(createAdminUser())
        ->from(route('materials.edit', $material->id))
        ->patch(route('materials.update', $material->id), [
            'code' => '90091110',
            'name' => 'Updated material name',
            'price' => 1200000,
            'material_unit_id' => MaterialUnit::factory()->create()->id - 1,
            'material_type_id' => MaterialType::factory()->create()->id - 1,
        ])
        ->assertRedirect(route('materials.edit', $material->id));

    assertDatabaseHas('materials', ['code' => '90091110']);
});

test('update material fails validation', function () {
    $material = Material::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('materials.edit', $material->id))
        ->patch(route('materials.update', $material->id), [
            'code' => '1001876s',
            'name' => '',
            'price' => 's',
            'material_unit_id' => MaterialUnit::factory()->create()->id + 1,
            'material_type_id' => MaterialType::factory()->create()->id + 1,
        ])
        ->assertSessionHasErrors([
            'code',
            'name',
            'price',
            'material_unit_id',
            'material_type_id',
        ]);
});

test('can delete material', function () {
    $material = Material::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('materials.index'))
        ->delete(route('materials.destroy', $material->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Material deleted successfully',
        ]);

    expect(Material::find($material->id))->toBeNull();
});
