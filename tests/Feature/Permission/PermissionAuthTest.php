<?php

use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Permission', 'User', 'Permission']);
});

test('normal user cannot access permission index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('permissions.index'))
        ->assertStatus(403);
});

test('normal user cannot access permission create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('permissions.create'))
        ->assertStatus(403);
});

test('normal user cannot access permission edit form', function () {
    $user = createNormalUser();
    $permission = Permission::first();

    $this->actingAs($user)
        ->get(route('permissions.edit', $permission->id))
        ->assertStatus(403);
});

test('guest cannot access permission index page', function () {
    $this
        ->get(route('permissions.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access permission create form', function () {
    $this
        ->get(route('permissions.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access permission edit form', function () {
    $permission = Permission::first();

    $this
        ->get(route('permissions.edit', $permission->id))
        ->assertRedirect(route('login'));
});
