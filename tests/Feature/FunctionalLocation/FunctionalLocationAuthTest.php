<?php

use App\Models\FunctionalLocation;
use Database\Seeders\FunctionalLocationSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_functionallocation']);
    Permission::create(['name' => 'read_functionallocation']);
    Permission::create(['name' => 'update_functionallocation']);
    Permission::create(['name' => 'delete_functionallocation']);

    $this->seed(FunctionalLocationSeeder::class);
});

test('normal user cannot access functional location index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('functional-locations.index'))
        ->assertStatus(403);
});

test('normal user cannot access functional location create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('functional-locations.create'))
        ->assertStatus(403);
});

test('normal user cannot access functional location edit form', function () {
    $user = createNormalUser();
    $functionallocation = FunctionalLocation::first();

    $this->actingAs($user)
        ->get(route('functional-locations.edit', $functionallocation))
        ->assertStatus(403);
});

test('guest cannot access functional location index page', function () {
    $this
        ->get(route('functional-locations.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access functional location create form', function () {
    $this
        ->get(route('functional-locations.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access functional location edit form', function () {
    $functionallocation = FunctionalLocation::first();

    $this
        ->get(route('functional-locations.edit', $functionallocation->id))
        ->assertRedirect(route('login'));
});
