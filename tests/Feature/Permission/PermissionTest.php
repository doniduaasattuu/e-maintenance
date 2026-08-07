<?php

use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Permission']);
});

test('admin can store permission with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('permissions.create'))
        ->post(route('permissions.store'), [
            'name' => 'index_feature',
            'guard_name' => 'web'
        ])
        ->assertRedirect(route('permissions.create'));

    $this->assertDatabaseHas('permissions', ['name' => 'index_feature']);
});

test('admin cannot create permission with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post('/permissions', [
            'name' => null,
            'guard_name' => 'web'
        ])
        ->assertSessionHasErrors(['name']);
});

test('admin cannot create duplicate permission', function () {
    $admin = createAdminUser();
    Permission::create(['name' => 'index_seeder']);

    $this->actingAs($admin)
        ->from(route('permissions.create'))
        ->post('/permissions', [
            'name' => 'index_seeder',
            'guard_name' => 'web'
        ])
        ->assertSessionHasErrors('name');
});

test('admin can update permission', function () {
    $admin = createAdminUser();
    $permission = Permission::create(['name' => 'index_seeder', 'guard_name' => 'web']);
    $editPage = route('permissions.edit', $permission->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->put(route('permissions.update', $permission->id), [
            'name' => 'index_feeder',
            'guard_name' => 'web',
        ])
        ->assertStatus(302)
        ->assertRedirect(route('permissions.edit', $permission->id));

    $this->assertDatabaseHas('permissions', ['name' => 'index_feeder']);
});
