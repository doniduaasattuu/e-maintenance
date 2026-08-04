<?php

use App\Models\FindingType;
use Database\Seeders\FindingTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingType']);

    $this->seed(FindingTypeSeeder::class);
});

test('normal user cannot access finding type index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-types.index'))
        ->assertStatus(403);
});

test('normal user cannot access finding type create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-types.create'))
        ->assertStatus(403);
});

test('normal user cannot access finding type edit form', function () {
    $user = createNormalUser();
    $findingStatus = FindingType::first();

    $this->actingAs($user)
        ->get(route('finding-types.edit', $findingStatus))
        ->assertStatus(403);
});

test('guest cannot access finding type index page', function () {
    $this
        ->get(route('finding-types.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding type create form', function () {
    $this
        ->get(route('finding-types.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding type edit form', function () {
    $findingStatus = FindingType::first();

    $this
        ->get(route('finding-types.edit', $findingStatus->id))
        ->assertRedirect(route('login'));
});
