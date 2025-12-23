<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['User']);

    $this->seed(DivisionSeeder::class);
    $this->seed(DepartmentSeeder::class);
    $this->seed(PositionSeeder::class);
    $this->seed(WorkCenterSeeder::class);
    Role::create(['name' => 'Inspector']);
    Role::create(['name' => 'Supervisor']);
    Role::create(['name' => 'Management']);

    User::factory()->count(20)->create();
});

test('normal user cannot access user index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('users.index'))
        ->assertStatus(403);
});

test('normal user cannot access user create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('users.create'))
        ->assertStatus(403);
});

test('normal user cannot access user edit form', function () {
    $user = createNormalUser();
    $user = User::first();

    $this->actingAs($user)
        ->get(route('users.edit', $user))
        ->assertStatus(403);
});

test('guest cannot access user index page', function () {
    $this
        ->get(route('users.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access user create form', function () {
    $this
        ->get(route('users.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access user edit form', function () {
    $user = User::first();

    $this
        ->get(route('users.edit', $user->id))
        ->assertRedirect(route('login'));
});
