<?php

use App\Models\Department;
use App\Models\FunctionalLocation;
use App\Models\Plant;
use App\Models\WorkCenter;
use Database\Seeders\PlantSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function PHPUnit\Framework\assertCount;
use function PHPUnit\Framework\assertNotNull;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Plant']);
    $this->seed([
        PlantSeeder::class,
    ]);
});

test('admin can create plant with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('plants.create'))
        ->post(route('plants.store'), [
            'code' => 'PM01',
            'name' => 'Paper Machine 1',
        ])
        ->assertRedirect(route('plants.create'));
});

test('admin cannot create plant with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('plants.create'))
        ->post(route('plants.store'), [
            'code' => null,
            'name' => null,
        ])
        ->assertSessionHasErrors(['code', 'name']);
});

test('admin cannot create duplicate plant', function () {
    $admin = createAdminUser();
    $plant = Plant::first();

    $this->actingAs($admin)
        ->from(route('plants.create'))
        ->post(route('plants.store'), [
            'name' => $plant->name,
            'code' => $plant->code,
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin can update plant', function () {
    $admin = createAdminUser();
    $plant = Plant::first();

    $editPage = route('plants.edit', $plant->id);
    $updatePage = route('plants.update', $plant->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->patch($updatePage, [
            'code' => 'PM01',
            'name' => 'Paper Machine 1',
        ])
        ->assertRedirect($editPage);

    $this->assertDatabaseHas('plants', ['name' => 'Paper Machine 1']);
});

test('plant have functional locations', function () {
    $plant = Plant::first();
    assertNotNull($plant);

    $functionalLocations = FunctionalLocation::factory()->count(12)->create([
        'plant_id' => $plant->id,
    ]);

    assertNotNull($functionalLocations);
    assertCount(12, $functionalLocations);
});
