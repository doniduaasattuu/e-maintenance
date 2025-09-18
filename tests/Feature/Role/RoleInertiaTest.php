<?php

use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_role']);
    Permission::create(['name' => 'read_role']);
    Permission::create(['name' => 'update_role']);
    Permission::create(['name' => 'delete_role']);
    Permission::create(['name' => 'create_user']);
    Permission::create(['name' => 'read_user']);
    Permission::create(['name' => 'update_user']);
    Permission::create(['name' => 'delete_user']);

    Role::create(['name' => 'Editor']);
    Role::create(['name' => 'Inspector']);
});

test('role index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('roles.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('role/index')
                ->has('roles.data', 3)
        );

    $this->actingAs($admin)
        ->get(route('roles.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('role/index')
                ->has('roles.data', 0)
        );
});

test('role create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('roles.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('role/create')
        );
});

test('role edit form should be rendered', function () {
    $admin = createAdminUser();
    $role = Role::orderBy('id', 'ASC')->first();

    $this->actingAs($admin)
        ->get(route('roles.edit', $role->id))
        ->assertInertia(
            fn($page) => $page
                ->component('role/edit')
                ->has('role.data')
                ->has('role.data.id')
                ->has('role.data.name')
        );
});

test('role edit admin form should be rendered', function () {
    $admin = createAdminUser();
    $role = Role::where('name', 'Admin')->first();

    $this->actingAs($admin)
        ->get(route('roles.edit', $role->id))
        ->assertStatus(200);
});

test('role admin should cannot be deleted', function () {
    $admin = createAdminUser();
    $role = Role::where('name', 'Admin')->first();

    $this->actingAs($admin)
        ->delete(route('roles.destroy', $role->id))
        ->assertStatus(403);
});
