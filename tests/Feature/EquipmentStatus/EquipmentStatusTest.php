<?php

use App\Models\EquipmentStatus;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipmentstatus']);
    Permission::create(['name' => 'read_equipmentstatus']);
    Permission::create(['name' => 'update_equipmentstatus']);
    Permission::create(['name' => 'delete_equipmentstatus']);

    $this->seed(EquipmentStatusSeeder::class);
});

test('equipment status index page accessible', function () {
    EquipmentStatus::factory()->count(20)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-statuses.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-status/index')
                ->has('equipmentStatuses.data', 15)
        );
});

test('create equipment status page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-statuses.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('equipment-status/create')
        );
});

test('store equipment status successfully', function () {
    EquipmentStatus::factory()->count(5)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-statuses.create'))
        ->post(route('equipment-statuses.store'), [
            'code' => 'MTC',
            'name' => 'MAINTENANCE',
            'description' => 'Equipment under maintenance.'
        ]);

    $response
        ->assertRedirect(route('equipment-statuses.create'));

    $equipmentStatus = EquipmentStatus::where('code', 'MTC')->first();
    expect($equipmentStatus)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('equipment-statuses.store'), [
            'code' => '',
            'name' => '',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['code', 'name']);
});

test('edit page accessible', function () {
    $equipmentStatus = EquipmentStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-statuses.edit', $equipmentStatus->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-status/edit')
                ->has('equipmentStatus.data')
                ->has('equipmentStatus.data.id')
                ->has('equipmentStatus.data.code')
                ->has('equipmentStatus.data.name')
                ->has('equipmentStatus.data.description')
        );
});

test('update equipment status successfully', function () {
    $equipmentStatus = EquipmentStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-statuses.edit', $equipmentStatus->id))
        ->put(route('equipment-statuses.update', $equipmentStatus->id), [
            'code' => 'MTC',
            'name' => 'MAINTENANCE',
        ])
        ->assertRedirect(route('equipment-statuses.edit', $equipmentStatus->id));

    $equipmentStatus->refresh();
    expect($equipmentStatus->code)->toBe('MTC');
    expect($equipmentStatus->name)->toBe('MAINTENANCE');
});

test('update equipment status fails validation', function () {
    $equipmentStatus = EquipmentStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-statuses.edit', $equipmentStatus->id))
        ->patch(route('equipment-statuses.update', $equipmentStatus->id), [
            'code' => '',
            'name' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['code', 'name']);
});

test('can delete equipment status', function () {
    $equipmentStatus = EquipmentStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-statuses.index'))
        ->delete(route('equipment-statuses.destroy', $equipmentStatus->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Equipment status deleted successfully',
        ]);

    expect(EquipmentStatus::find($equipmentStatus->id))->toBeNull();
});
