<?php

use App\Models\User;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class);
uses(InteractsWithPermissions::class);

beforeEach(function () {
    $this->policy = new UserPolicy();

    $this->generatePermissions(['User']);
});

dataset('user-policy-permissions', [
    ['viewAny', 'index_user', false],
    ['create', 'create_user', false],
]);

dataset('user-policy-model-permissions', [
    ['view', 'show_user'],
    ['update', 'update_user'],
    ['delete', 'delete_user'],
    ['restore', 'restore_user'],
]);

it('grants permission for methods without model', function ($method, $permission) {
    $user = $this->givePermission(User::factory()->create(), $permission);

    expect($this->policy->$method($user))->toBeTrue();
})->with('user-policy-permissions');

it('denies permission for methods without model', function ($method) {
    $user = User::factory()->create();

    expect($this->policy->$method($user))->toBeFalse();
})->with('user-policy-permissions');

it('grants permission for methods with model', function ($method, $permission) {
    $user = $this->givePermission(User::factory()->create(), $permission);
    $model = User::factory()->create();

    expect($this->policy->$method($user, $model))->toBeTrue();
})->with('user-policy-model-permissions');

it('denies permission for methods with model', function ($method) {
    $user = User::factory()->create();
    $model = User::factory()->create();

    expect($this->policy->$method($user, $model))->toBeFalse();
})->with('user-policy-model-permissions');

it('never allows force deleting users', function () {
    $user = User::factory()->create();
    $model = User::factory()->create();

    expect($this->policy->forceDelete($user, $model))->toBeFalse();
});
