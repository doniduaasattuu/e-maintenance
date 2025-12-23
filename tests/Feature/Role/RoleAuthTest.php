<?php

use Spatie\Permission\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Role', 'User']);

    Role::create([
        'name' => 'Admin',
        'name' => 'Editor',
        'name' => 'Inspector',
    ]);
});

test('normal user cannot access role index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('roles.index'))
        ->assertStatus(403);
});

test('normal user cannot access role create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('roles.create'))
        ->assertStatus(403);
});

test('normal user cannot access role edit form', function () {
    $user = createNormalUser();
    $role = Role::first();

    $this->actingAs($user)
        ->get(route('roles.edit', $role))
        ->assertStatus(403);
});

test('guest cannot access role index page', function () {
    $this
        ->get(route('roles.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access role create form', function () {
    $this
        ->get(route('roles.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access role edit form', function () {
    $role = Role::first();

    $this
        ->get(route('roles.edit', $role->id))
        ->assertRedirect(route('login'));
});
