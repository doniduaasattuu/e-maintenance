<?php

use App\Models\User;
use App\Policies\RolePolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class);
uses(InteractsWithPermissions::class);

beforeEach(function () {
    $this->policy = new RolePolicy();

    Permission::findOrCreate('update_role');
    Permission::findOrCreate('delete_role');

    Role::findOrCreate('Admin');
    Role::findOrCreate('Operator');
});

it('denies viewing any roles', function () {
    $user = User::factory()->create();

    expect($this->policy->viewAny($user))->toBeFalse();
});

it('denies viewing a role', function () {
    $user = User::factory()->create();
    $role = Role::findByName('Operator');

    expect($this->policy->view($user, $role))->toBeFalse();
});

it('denies creating roles', function () {
    $user = User::factory()->create();

    expect($this->policy->create($user))->toBeFalse();
});

it('allows admin with update permission to update a role', function () {
    $user = User::factory()->create();

    $this->givePermission($user, 'update_role');
    $user->assignRole('Admin');

    $role = Role::findByName('Operator');

    expect($this->policy->update($user, $role))->toBeTrue();
});

it('denies updating role without permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $role = Role::findByName('Operator');

    expect($this->policy->update($user, $role))->toBeFalse();
});

it('denies updating role when user is not admin', function () {
    $user = User::factory()->create();

    $this->givePermission($user, 'update_role');

    $role = Role::findByName('Operator');

    expect($this->policy->update($user, $role))->toBeFalse();
});

it('allows admin with delete permission to delete non admin role', function () {
    $user = User::factory()->create();

    $this->givePermission($user, 'delete_role');
    $user->assignRole('Admin');

    $role = Role::findByName('Operator');

    expect($this->policy->delete($user, $role))->toBeTrue();
});

it('denies deleting admin role', function () {
    $user = User::factory()->create();

    $this->givePermission($user, 'delete_role');
    $user->assignRole('Admin');

    $role = Role::findByName('Admin');

    expect($this->policy->delete($user, $role))->toBeFalse();
});

it('denies deleting role without permission', function () {
    $user = User::factory()->create();
    $user->assignRole('Admin');

    $role = Role::findByName('Operator');

    expect($this->policy->delete($user, $role))->toBeFalse();
});

it('denies deleting role when user is not admin', function () {
    $user = User::factory()->create();

    $this->givePermission($user, 'delete_role');

    $role = Role::findByName('Operator');

    expect($this->policy->delete($user, $role))->toBeFalse();
});

it('denies restoring roles', function () {
    $user = User::factory()->create();
    $role = Role::findByName('Operator');

    expect($this->policy->restore($user, $role))->toBeFalse();
});

it('never allows force deleting roles', function () {
    $user = User::factory()->create();
    $role = Role::findByName('Operator');

    expect($this->policy->forceDelete($user, $role))->toBeFalse();
});
