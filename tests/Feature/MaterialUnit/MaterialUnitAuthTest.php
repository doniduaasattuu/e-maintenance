<?php

use App\Models\MaterialUnit;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['MaterialUnit']);

    $this->seed(MaterialUnitSeeder::class);
});

test('normal user cannot access unit index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('material-units.index'))
        ->assertStatus(403);
});

test('normal user cannot access unit create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('material-units.create'))
        ->assertStatus(403);
});

test('normal user cannot access unit edit form', function () {
    $user = createNormalUser();
    $unit = MaterialUnit::first();

    $this->actingAs($user)
        ->get(route('material-units.edit', $unit))
        ->assertStatus(403);
});

test('guest cannot access unit index page', function () {
    $this
        ->get(route('material-units.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access unit create form', function () {
    $this
        ->get(route('material-units.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access unit edit form', function () {
    $unit = MaterialUnit::first();

    $this
        ->get(route('material-units.edit', $unit->id))
        ->assertRedirect(route('login'));
});
