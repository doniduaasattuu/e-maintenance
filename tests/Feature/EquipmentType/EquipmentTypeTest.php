<?php

use App\Models\EquipmentClass;
use App\Models\EquipmentType;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['EquipmentType']);

    $this->seed([
        EquipmentClassSeeder::class,
        EquipmentTypeSeeder::class
    ]);
});

test('equipment type index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-types.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-type/index')
                ->has('equipmentTypes.data', 4)
        );
});

test('create equipment type page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-types.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('equipment-type/create')
        );
});

test('store equipment type successfully', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-types.create'))
        ->post(route('equipment-types.store'), [
            'equipment_class_id' => EquipmentClass::get()->random()->id,
            'code' => 'ZTYPE_M001',
            'name' => 'Motor AC',
            'description' => 'Motor AC Low Voltage',
            'is_active' => '1',
        ]);

    $response
        ->assertRedirect(route('equipment-types.create'));

    $equipmentType = EquipmentType::where('code', 'ZTYPE_M001')->first();
    expect($equipmentType)->not()->toBeNull();
});

test('store equipment type fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('equipment-types.store'), [
            'equipment_class_id' => null,
            'code' => null,
            'name' => null,
            'description' => null,
            'is_active' => null,
        ]);

    $response->assertSessionHasErrors(['code', 'name', 'equipment_class_id', 'is_active']);
});

test('edit equipment type page accessible', function () {
    $equipmentType = EquipmentType::factory()->create([
        'equipment_class_id' => EquipmentClass::first()->id,
    ]);

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-types.edit', $equipmentType->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-type/edit')
                ->has('equipmentType.data')
                ->has('equipmentType.data.id')
                ->has('equipmentType.data.code')
                ->has('equipmentType.data.name')
                ->has('equipmentType.data.equipment_class_id')
                ->has('equipmentType.data.description')
        );
});

test('update equipment type successfully', function () {
    $equipmentType = EquipmentType::factory()->create([
        'equipment_class_id' => EquipmentClass::first()->id
    ]);

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-types.edit', $equipmentType->id))
        ->put(route('equipment-types.update', $equipmentType->id), [
            'equipment_class_id' => EquipmentClass::first()->id,
            'code' => 'ZTYPE_M001',
            'name' => 'Motor AC',
            'description' => 'Motor AC Low Voltage',
            'is_active' => '1',
        ])
        ->assertRedirect(route('equipment-types.edit', $equipmentType->id));

    $equipmentType->refresh();
    expect($equipmentType->code)->toBe('ZTYPE_M001');
    expect($equipmentType->description)->toBe('Motor AC Low Voltage');
});

test('update equipment type fails validation', function () {
    $equipmentType = EquipmentType::factory()->create([
        'equipment_class_id' => EquipmentClass::first()->id
    ]);

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-types.edit', $equipmentType->id))
        ->patch(route('equipment-types.update', $equipmentType->id), [
            'equipment_class_id' => null,
            'code' => null,
            'name' => null,
            'description' => null,
            'is_active' => null,
        ])
        ->assertSessionHasErrors(['code', 'name', 'equipment_class_id', 'is_active']);
});

test('can delete equipment type', function () {
    $equipmentType = EquipmentType::factory()->create([
        'equipment_class_id' => EquipmentClass::first()->id
    ]);

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-types.index'))
        ->delete(route('equipment-types.destroy', $equipmentType->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Equipment type deleted successfully',
        ]);

    expect(EquipmentType::find($equipmentType->id))->toBeNull();
});
