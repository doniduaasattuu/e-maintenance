<?php

use App\Models\Equipment;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Equipment']);
});

test('normal user cannot access equipment index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipments.index'))
        ->assertStatus(403);
});

test('normal user cannot access equipment create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('equipments.create'))
        ->assertStatus(403);
});

test('normal user cannot access equipment edit form', function () {
    $user = createNormalUser();
    $equipment = Equipment::factory()->create();

    $this->actingAs($user)
        ->get(route('equipments.edit', $equipment))
        ->assertStatus(403);
});

test('guest cannot access equipment index page', function () {
    $this
        ->get(route('equipments.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment create form', function () {
    $this
        ->get(route('equipments.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access equipment edit form', function () {
    $equipment = Equipment::factory()->create();

    $this
        ->get(route('equipments.edit', $equipment->id))
        ->assertRedirect(route('login'));
});
