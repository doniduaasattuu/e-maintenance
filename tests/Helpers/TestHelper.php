<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

function createAdminUser(array $fields = []): User
{
    $admin = User::factory()->create($fields);

    $role = Role::firstOrCreate(['name' => 'Admin']);
    $role->givePermissionTo(Permission::all());

    $admin->assignRole($role);

    return $admin;
}

function createNormalUser(): User
{
    return User::factory()->create();
}

function createInspectorUser(): User
{
    $inspector = User::factory()->create();

    $role = Role::firstOrCreate([
        'name' => 'Inspector'
    ]);
    $role->givePermissionTo(Permission::all());

    $inspector->assignRole($role);

    return $inspector;
}
