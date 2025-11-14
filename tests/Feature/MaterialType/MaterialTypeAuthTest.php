<?php

use App\Models\MaterialType;
use Database\Seeders\MaterialTypeSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_materialtype']);
    Permission::create(['name' => 'read_materialtype']);
    Permission::create(['name' => 'update_materialtype']);
    Permission::create(['name' => 'delete_materialtype']);

    $this->seed(MaterialTypeSeeder::class);
});

test('normal user cannot access material type index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('material-types.index'))
        ->assertStatus(403);
});

test('normal user cannot access material type create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('material-types.create'))
        ->assertStatus(403);
});

test('normal user cannot access material type edit form', function () {
    $user = createNormalUser();
    $materialtype = MaterialType::first();

    $this->actingAs($user)
        ->get(route('material-types.edit', $materialtype->id))
        ->assertStatus(403);
});

test('guest cannot access material type index page', function () {
    $this
        ->get(route('material-types.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access material type create form', function () {
    $this
        ->get(route('material-types.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access material type edit form', function () {
    $materialtype = MaterialType::first();

    $this
        ->get(route('material-types.edit', $materialtype->id))
        ->assertRedirect(route('login'));
});
