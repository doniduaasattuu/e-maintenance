<?php

use App\Models\Material;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\UnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Image']);

    $this->seed(UnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
    $this->seed(MaterialSeeder::class);
});

test('normal user cannot access material image page', function () {
    $user = createNormalUser();
    $material = Material::first();

    $this->actingAs($user)
        ->get(route('images.material.index', [
            'id' => $material->id,
            'type' => 'material',
        ]))
        ->assertStatus(403);
});

test('admin user cannot access material image page', function () {
    $admin = createAdminUser();
    $material = Material::first();

    $material->images()->createMany([
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
    ]);

    $this->actingAs($admin)
        ->get(route('images.material.index', [
            'id' => $material->id,
            'type' => 'material',
        ]))
        ->assertStatus(200);
});

test('guest cannot access material image page', function () {
    $material = Material::first();

    $this
        ->get(route('images.material.index', [
            'id' => $material->id,
            'type' => 'material',
        ]))
        ->assertRedirect(route('login'));
});
