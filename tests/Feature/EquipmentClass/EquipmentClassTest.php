<?php

use App\Models\EquipmentClass;
use App\Models\User;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipmentclass']);
    Permission::create(['name' => 'read_equipmentclass']);
    Permission::create(['name' => 'update_equipmentclass']);
    Permission::create(['name' => 'delete_equipmentclass']);

    $this->seed(EquipmentClassSeeder::class);
});

test('equipment class index page accessible', function () {
    EquipmentClass::factory()->count(20)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-classes.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-class/index')
                ->has('equipmentClasses.data', 15)
        );
});

test('create equipment class page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-classes.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('equipment-class/create')
        );
});

test('store equipment class successfully', function () {
    EquipmentClass::factory()->count(5)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-classes.create'))
        ->post(route('equipment-classes.store'), [
            'code' => 'ZCLASS_E008',
            'name' => 'ELECTRICAL PANEL',
            'formable' => 'PANEL',
            'description' => 'Distribution panels for managing electrical circuits and power systems.'
        ]);

    $response
        ->assertRedirect(route('equipment-classes.create'));

    $equipmentClass = EquipmentClass::where('code', 'ZCLASS_E008')->first();
    expect($equipmentClass)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('equipment-classes.store'), [
            'code' => '',
            'name' => '',
            'formable' => 'PANEL LISTRIK',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['code', 'name']);
});

test('edit page accessible', function () {
    $equipmentClass = EquipmentClass::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-classes.edit', $equipmentClass->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-class/edit')
                ->has('equipmentClass.data')
                ->has('equipmentClass.data.id')
                ->has('equipmentClass.data.code')
                ->has('equipmentClass.data.name')
                ->has('equipmentClass.data.formable')
                ->has('equipmentClass.data.description')
        );
});

test('update equipment class successfully', function () {
    $equipmentClass = EquipmentClass::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-classes.edit', $equipmentClass->id))
        ->put(route('equipment-classes.update', $equipmentClass->id), [
            'code' => 'ZCLASS_E111',
            'name' => 'FIRE EXTINGUISHER',
            'formable' => 'APAR'
        ])
        ->assertRedirect(route('equipment-classes.edit', $equipmentClass->id));

    $equipmentClass->refresh();
    expect($equipmentClass->code)->toBe('ZCLASS_E111');
    expect($equipmentClass->name)->toBe('FIRE EXTINGUISHER');
});

test('update equipment class fails validation', function () {
    $equipmentClass = EquipmentClass::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-classes.edit', $equipmentClass->id))
        ->patch(route('equipment-classes.update', $equipmentClass->id), [
            'code' => '',
            'name' => 'lowercase name',
            'formable' => 'pemadam api',
            'description' => '',
        ])
        ->assertSessionHasErrors(['code', 'name']);
});

test('can delete equipment class', function () {
    $equipmentClass = EquipmentClass::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipment-classes.index'))
        ->delete(route('equipment-classes.destroy', $equipmentClass->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Equipment class deleted successfully',
        ]);

    expect(EquipmentClass::find($equipmentClass->id))->toBeNull();
});
