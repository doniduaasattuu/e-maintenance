<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_role']);
    Permission::create(['name' => 'read_role']);
    Permission::create(['name' => 'update_role']);
    Permission::create(['name' => 'delete_role']);
});

test('admin can create role with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('roles.create'))
        ->post('/roles', [
            'name' => 'Supervisor',
            'selectedPermissions' => ['create_role', 'read_role']
        ])
        ->assertRedirect(route('roles.create'));

    $this->assertDatabaseHas('roles', ['name' => 'Supervisor']);
});

test('admin cannot create role with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->post('/roles', [
            'name' => '',
            'selectedPermissions' => []
        ])
        ->assertSessionHasErrors(['name', 'selectedPermissions']);
});

test('admin cannot create duplicate role', function () {
    $admin = createAdminUser();
    Role::create(['name' => 'Supervisor']);

    $this->actingAs($admin)
        ->from(route('roles.create'))
        ->post('/roles', [
            'name' => 'Supervisor',
            'selectedPermissions' => ['create_role']
        ])
        ->assertSessionHasErrors('name');
});

test('admin can update role', function () {
    $admin = createAdminUser();
    $role = Role::create(['name' => 'Supervisor']);
    $editPage = route('roles.edit', $role->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->put("/roles/{$role->id}", [
            'name' => 'Department Head',
            'selectedPermissions' => ['read_role']
        ])
        ->assertRedirect($editPage);

    $this->assertDatabaseHas('roles', ['name' => 'Department Head']);
});

test('admin can update Admin role', function () {
    $admin = createAdminUser();
    $role = Role::where('name', 'Admin')->first();

    $this->actingAs($admin)
        ->get(route('roles.edit', $role->id))
        ->assertStatus(200);
});

test('admin can delete role other than Admin', function () {
    $admin = createAdminUser();
    $role = Role::create(['name' => 'Temporary']);

    $this->actingAs($admin)
        ->from(route('roles.index'))
        ->delete("/roles/{$role->id}")
        ->assertRedirect(route('roles.index'));

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('admin cannot delete Admin role', function () {
    $admin = createAdminUser();
    $role = Role::where('name', 'Admin')->first();

    $this->actingAs($admin)
        ->delete("/roles/{$role->id}")
        ->assertForbidden();
});

test('admin can access role routes', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get('/roles')
        ->assertOk();
});

test('non-admin cannot access role routes', function () {
    $user = createNormalUser();
    $role = Role::create(['name' => 'Temporary']);

    $this->actingAs($user)
        ->get('/roles')
        ->assertForbidden();

    $this->actingAs($user)
        ->post('/roles', [
            'name' => 'Something',
            'selectedPermissions' => ['create_role']
        ])
        ->assertForbidden();

    $this->actingAs($user)
        ->get(route('roles.edit', $role->id))
        ->assertForbidden();
});
