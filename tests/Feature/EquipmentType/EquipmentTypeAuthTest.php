<?php

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

test('normal user cannot access equipment type index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-types.index'))
        ->assertStatus(403);
});

test('normal user cannot access equipment type create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-types.create'))
        ->assertStatus(403);
});

test('normal user cannot access equipment type edit form', function () {
    $user = createNormalUser();
    $equipmenttype = EquipmentType::first();

    $this->actingAs($user)
        ->get(route('equipment-types.edit', $equipmenttype->id))
        ->assertStatus(403);
});

test('guest cannot access equipment type index page', function () {
    $this
        ->get(route('equipment-types.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment type create form', function () {
    $this
        ->get(route('equipment-types.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment type edit form', function () {
    $equipmenttype = EquipmentType::first();

    $this
        ->get(route('equipment-types.edit', $equipmenttype->id))
        ->assertRedirect(route('login'));
});
