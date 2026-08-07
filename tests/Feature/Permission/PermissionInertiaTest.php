<?php

use Database\Seeders\PermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Permission', 'User', 'Permission']);
});

test('permission index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('permissions.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('permission/index')
                ->has('permissions.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('permissions.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('permission/index')
                ->has('permissions.data', 8)
        );
});

test('permission create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('permissions.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('permission/create')
        );
});

test('permission edit form should not be rendered', function () {
    $admin = createAdminUser();
    $permission = Permission::orderBy('id', 'ASC')->first();
    expect($permission)->not()->toBeNull();

    $this->actingAs($admin)
        ->get(route('permissions.edit', $permission->id))
        ->assertStatus(200);
});
