<?php

use App\Models\EquipmentClass;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipmentclass']);
    Permission::create(['name' => 'read_equipmentclass']);
    Permission::create(['name' => 'update_equipmentclass']);
    Permission::create(['name' => 'delete_equipmentclass']);

    $this->seed(EquipmentClassSeeder::class);
});

test('normal user cannot access equipment class index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-classes.index'))
        ->assertStatus(403);
});

test('normal user cannot access equipment class create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-classes.create'))
        ->assertStatus(403);
});

test('normal user cannot access equipment class edit form', function () {
    $user = createNormalUser();
    $equipmentClass = EquipmentClass::first();

    $this->actingAs($user)
        ->get(route('equipment-classes.edit', $equipmentClass))
        ->assertStatus(403);
});

test('guest cannot access equipment class index page', function () {
    $this
        ->get(route('equipment-classes.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment class create form', function () {
    $this
        ->get(route('equipment-classes.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment class edit form', function () {
    $equipmentClass = EquipmentClass::first();

    $this
        ->get(route('equipment-classes.edit', $equipmentClass->id))
        ->assertRedirect(route('login'));
});
