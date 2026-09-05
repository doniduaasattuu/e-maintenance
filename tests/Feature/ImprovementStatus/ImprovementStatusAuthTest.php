<?php

use App\Models\ImprovementStatus;
use Database\Seeders\ImprovementStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementStatus']);

    $this->seed(ImprovementStatusSeeder::class);
});

test('normal user cannot access improvement status index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('improvement-statuses.index'))
        ->assertStatus(403);
});

test('normal user cannot access improvement status create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('improvement-statuses.create'))
        ->assertStatus(403);
});

test('normal user cannot access improvement status edit form', function () {
    $user = createNormalUser();
    $improvementStatus = ImprovementStatus::first();

    $this->actingAs($user)
        ->get(route('improvement-statuses.edit', $improvementStatus))
        ->assertStatus(403);
});

test('guest cannot access improvement status index page', function () {
    $this
        ->get(route('improvement-statuses.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access improvement status create form', function () {
    $this
        ->get(route('improvement-statuses.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access improvement status edit form', function () {
    $improvementStatus = ImprovementStatus::first();

    $this
        ->get(route('improvement-statuses.edit', $improvementStatus->id))
        ->assertRedirect(route('login'));
});
