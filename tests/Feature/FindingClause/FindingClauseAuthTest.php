<?php

use App\Models\FindingClause;
use Database\Seeders\FindingClauseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingClause']);

    $this->seed(FindingClauseSeeder::class);
});

test('normal user cannot access finding clause index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-clauses.index'))
        ->assertStatus(403);
});

test('normal user cannot access finding clause create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('finding-clauses.create'))
        ->assertStatus(403);
});

test('normal user cannot access finding clause edit form', function () {
    $user = createNormalUser();
    $findingClause = FindingClause::first();

    $this->actingAs($user)
        ->get(route('finding-clauses.edit', $findingClause))
        ->assertStatus(403);
});

test('guest cannot access finding clause index page', function () {
    $this
        ->get(route('finding-clauses.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding clause create form', function () {
    $this
        ->get(route('finding-clauses.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access finding clause edit form', function () {
    $findingClause = FindingClause::first();

    $this
        ->get(route('finding-clauses.edit', $findingClause->id))
        ->assertRedirect(route('login'));
});
