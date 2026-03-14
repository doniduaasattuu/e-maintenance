<?php

use App\Models\Equipment;
use App\Models\Material;
use App\Models\Repository;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Database\Seeders\RepositorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Repository', 'Material']);

    $this->seed(RepositorySeeder::class);
    $this->seed(MaterialUnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
});

test('can attach equipment to a repository', function () {

    $repository = Repository::factory()->create();
    $equipment = Equipment::factory()->create();

    $response = actingAs(createAdminUser())
        ->post(route('repositories.equipment.store', [
            'repository' => $repository->id,
            'equipment' => $equipment->id
        ]));

    $response->assertRedirect();
    $response->assertSessionHas('message.type', 'success');

    assertDatabaseHas('equipment_repository', [
        'repository_id' => $repository->id,
        'equipment_id'  => $equipment->id
    ]);
});

test('can detach equipment from a repository', function () {
    $repository = Repository::factory()->create();
    $equipment = Equipment::factory()->create();

    $repository->equipments()->attach($equipment->id);

    $response = actingAs(createAdminUser())
        ->delete(route('repositories.equipment.destroy', [
            'repository' => $repository->id,
            'equipment' => $equipment->id
        ]));

    $response->assertRedirect();

    assertDatabaseMissing('equipment_repository', [
        'repository_id' => $repository->id,
        'equipment_id'  => $equipment->id
    ]);
});

test('can attach material to a repository', function () {
    $repository = Repository::factory()->create();
    $material = Material::factory()->create();

    expect($repository)->not()->toBeNull();
    expect($material)->not()->toBeNull();

    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('repositories.material.store', [
            'repository' => $repository->id,
            'material' => $material->id
        ]));

    $response->assertSessionHas('message.type', 'success');
    $response->assertRedirect();

    assertDatabaseHas('material_repository', [
        'repository_id' => $repository->id,
        'material_id'   => $material->id
    ]);
});

test('pivot records are removed when repository is deleted', function () {
    Storage::fake('public');

    $repository = Repository::factory()->create(['path' => 'repositories/test.pdf']);
    $equipment = Equipment::factory()->create();
    $material = Material::factory()->create();

    $repository->equipments()->attach($equipment->id);
    $repository->materials()->attach($material->id);

    $this->assertDatabaseHas('equipment_repository', [
        'repository_id' => $repository->id,
        'equipment_id' => $equipment->id
    ]);

    $response = actingAs(createAdminUser())
        ->delete(route('repositories.destroy', $repository->id));

    $response->assertRedirect();
    assertDatabaseMissing('repositories', ['id' => $repository->id]);

    assertDatabaseMissing('equipment_repository', [
        'repository_id' => $repository->id,
        'equipment_id' => $equipment->id
    ]);

    assertDatabaseMissing('material_repository', [
        'repository_id' => $repository->id,
        'material_id' => $material->id
    ]);

    $this->assertDatabaseHas('equipments', ['id' => $equipment->id]);
    $this->assertDatabaseHas('materials', ['id' => $material->id]);
});
