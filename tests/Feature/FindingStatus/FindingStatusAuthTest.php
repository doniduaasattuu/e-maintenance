<?php

use App\Models\FindingStatus;
use Database\Seeders\FindingStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingStatus']);

    $this->seed(FindingStatusSeeder::class);
});

test('normal user cannot access finding status index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-statuses.index'))
        ->assertStatus(403);
});

test('normal user cannot access finding status create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-statuses.create'))
        ->assertStatus(403);
});

test('normal user cannot access finding status edit form', function () {
    $user = createNormalUser();
    $findingStatus = FindingStatus::first();

    $this->actingAs($user)
        ->get(route('finding-statuses.edit', $findingStatus))
        ->assertStatus(403);
});

test('guest cannot access finding status index page', function () {
    $this
        ->get(route('finding-statuses.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding status create form', function () {
    $this
        ->get(route('finding-statuses.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding status edit form', function () {
    $findingStatus = FindingStatus::first();

    $this
        ->get(route('finding-statuses.edit', $findingStatus->id))
        ->assertRedirect(route('login'));
});
