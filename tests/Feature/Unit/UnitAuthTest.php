<?php

use App\Models\Unit;
use Database\Seeders\UnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Unit']);

    $this->seed(UnitSeeder::class);
});

test('normal user cannot access unit index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('units.index'))
        ->assertStatus(403);
});

test('normal user cannot access unit create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('units.create'))
        ->assertStatus(403);
});

test('normal user cannot access unit edit form', function () {
    $user = createNormalUser();
    $unit = Unit::first();

    $this->actingAs($user)
        ->get(route('units.edit', $unit))
        ->assertStatus(403);
});

test('guest cannot access unit index page', function () {
    $this
        ->get(route('units.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access unit create form', function () {
    $this
        ->get(route('units.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access unit edit form', function () {
    $unit = Unit::first();

    $this
        ->get(route('units.edit', $unit->id))
        ->assertRedirect(route('login'));
});
