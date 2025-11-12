<?php

use App\Models\Equipment;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_image']);
    Permission::create(['name' => 'read_image']);
    Permission::create(['name' => 'update_image']);
    Permission::create(['name' => 'delete_image']);

    $this->seed(FunctionalLocationSeeder::class);
    $this->seed(EquipmentClassSeeder::class);
    $this->seed(EquipmentStatusSeeder::class);
    $this->seed(EquipmentSeeder::class);
});

test('normal user cannot access equipment image page', function () {
    $user = createNormalUser();
    $equipment = Equipment::first();

    $this->actingAs($user)
        ->get(route('images.index', ['equipment', $equipment->id]))
        ->assertStatus(403);
});

test('admin user cannot access equipment image page', function () {
    $admin = createAdminUser();
    $equipment = Equipment::first();

    $equipment->images()->createMany([
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
    ]);

    $this->actingAs($admin)
        ->get(route('images.index', ['equipment', $equipment->id]))
        ->assertStatus(200);
});

test('guest cannot access equipment image page', function () {
    $equipment = Equipment::first();

    $this
        ->get(route('images.index', ['equipment', $equipment->id]))
        ->assertRedirect(route('login'));
});
