<?php

use App\Models\Plant;
use Database\Seeders\PlantSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Plant']);
    $this->seed([
        PlantSeeder::class,
    ]);
});

test('normal user cannot access plant index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('plants.index'))
        ->assertStatus(403);
});

test('normal user cannot access plant create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('plants.create'))
        ->assertStatus(403);
});

test('normal user cannot access plant edit form', function () {
    $user = createNormalUser();
    $workcenter = Plant::first();

    $this->actingAs($user)
        ->get(route('plants.edit', $workcenter))
        ->assertStatus(403);
});

test('guest cannot access plant index page', function () {
    $this
        ->get(route('plants.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access plant create form', function () {
    $this
        ->get(route('plants.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access plant edit form', function () {
    $workcenter = Plant::first();

    $this
        ->get(route('plants.edit', $workcenter->id))
        ->assertRedirect(route('login'));
});
