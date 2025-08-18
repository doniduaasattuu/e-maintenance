<?php

use App\Models\EquipmentStatus;
use Database\Seeders\EquipmentStatusSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipmentstatus']);
    Permission::create(['name' => 'read_equipmentstatus']);
    Permission::create(['name' => 'update_equipmentstatus']);
    Permission::create(['name' => 'delete_equipmentstatus']);

    $this->seed(EquipmentStatusSeeder::class);
});

test('normal user cannot access equipment status index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-statuses.index'))
        ->assertStatus(403);
});

test('normal user cannot access equipment status create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipment-statuses.create'))
        ->assertStatus(403);
});

test('normal user cannot access equipment status edit form', function () {
    $user = createNormalUser();
    $equipmentStatus = EquipmentStatus::first();

    $this->actingAs($user)
        ->get(route('equipment-statuses.edit', $equipmentStatus))
        ->assertStatus(403);
});

test('guest cannot access equipment status index page', function () {
    $this
        ->get(route('equipment-statuses.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment status create form', function () {
    $this
        ->get(route('equipment-statuses.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment status edit form', function () {
    $equipmentStatus = EquipmentStatus::first();

    $this
        ->get(route('equipment-statuses.edit', $equipmentStatus->id))
        ->assertRedirect(route('login'));
});
