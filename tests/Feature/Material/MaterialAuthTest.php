<?php

use App\Models\Material;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\UnitSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_material']);
    Permission::create(['name' => 'read_material']);
    Permission::create(['name' => 'update_material']);
    Permission::create(['name' => 'delete_material']);

    $this->seed(UnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
});

test('normal user cannot access material index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('materials.index'))
        ->assertStatus(403);
});

test('normal user cannot access material create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('materials.create'))
        ->assertStatus(403);
});

test('normal user cannot access material edit form', function () {
    $user = createNormalUser();
    $material = Material::factory()->create();

    $this->actingAs($user)
        ->get(route('materials.edit', $material->id))
        ->assertStatus(403);
});

test('guest cannot access material index page', function () {
    $this
        ->get(route('materials.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access material create form', function () {
    $this
        ->get(route('materials.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access material edit form', function () {
    $material = Material::factory()->create();

    $this
        ->get(route('materials.edit', $material->id))
        ->assertRedirect(route('login'));
});
