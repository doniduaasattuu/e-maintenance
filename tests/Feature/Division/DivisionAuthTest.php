<?php

use App\Models\Division;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_division']);
    Permission::create(['name' => 'read_division']);
    Permission::create(['name' => 'update_division']);
    Permission::create(['name' => 'delete_division']);

    Division::factory()->count(20)->create();
});

test('normal user cannot access division index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('divisions.index'))
        ->assertStatus(403);
});

test('normal user cannot access division create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('divisions.create'))
        ->assertStatus(403);
});

test('normal user cannot access division edit form', function () {
    $user = createNormalUser();
    $division = Division::first();

    $this->actingAs($user)
        ->get(route('divisions.edit', $division))
        ->assertStatus(403);
});

test('guest cannot access division index page', function () {
    $this
        ->get(route('divisions.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access division create form', function () {
    $this
        ->get(route('divisions.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access division edit form', function () {
    $division = Division::first();

    $this
        ->get(route('divisions.edit', $division->id))
        ->assertRedirect(route('login'));
});
