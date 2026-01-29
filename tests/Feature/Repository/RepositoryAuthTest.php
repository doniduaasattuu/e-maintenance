<?php

use App\Models\Repository;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Repository']);
});

test('normal user cannot access repository index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('repositories.index'))
        ->assertStatus(403);
});

test('normal user cannot access repository create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('repositories.create'))
        ->assertStatus(403);
});

test('normal user cannot access repository edit form', function () {
    $user = createNormalUser();
    $repository = Repository::factory()->create();

    $this->actingAs($user)
        ->get(route('repositories.edit', $repository->id))
        ->assertStatus(403);
});

test('guest cannot access repository index page', function () {
    $this
        ->get(route('repositories.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access repository create form', function () {
    $this
        ->get(route('repositories.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access repository edit form', function () {
    $repository = Repository::factory()->create();

    $this
        ->get(route('repositories.edit', $repository->id))
        ->assertRedirect(route('login'));
});
