<?php

use App\Models\FunctionalLocation;
use Database\Seeders\FunctionalLocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FunctionalLocation']);

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
