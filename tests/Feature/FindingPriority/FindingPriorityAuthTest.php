<?php

use App\Models\FindingPriority;
use Database\Seeders\FindingPrioritySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingPriority']);

    $this->seed(FindingPrioritySeeder::class);
});

test('normal user cannot access finding priority index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-priorities.index'))
        ->assertStatus(403);
});

test('normal user cannot access finding priority create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-priorities.create'))
        ->assertStatus(403);
});

test('normal user cannot access finding priority edit form', function () {
    $user = createNormalUser();
    $findingStatus = FindingPriority::first();

    $this->actingAs($user)
        ->get(route('finding-priorities.edit', $findingStatus))
        ->assertStatus(403);
});

test('guest cannot access finding priority index page', function () {
    $this
        ->get(route('finding-priorities.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding priority create form', function () {
    $this
        ->get(route('finding-priorities.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding priority edit form', function () {
    $findingStatus = FindingPriority::first();

    $this
        ->get(route('finding-priorities.edit', $findingStatus->id))
        ->assertRedirect(route('login'));
});
