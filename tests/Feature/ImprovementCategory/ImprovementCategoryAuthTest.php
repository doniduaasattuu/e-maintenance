<?php

use App\Models\ImprovementCategory;
use Database\Seeders\ImprovementCategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementCategory']);

    $this->seed(ImprovementCategorySeeder::class);
});

test('normal user cannot access improvement category index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('improvement-categories.index'))
        ->assertStatus(403);
});

test('normal user cannot access improvement category create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('improvement-categories.create'))
        ->assertStatus(403);
});

test('normal user cannot access improvement category edit form', function () {
    $user = createNormalUser();
    $improvementCategory = ImprovementCategory::first();

    $this->actingAs($user)
        ->get(route('improvement-categories.edit', $improvementCategory))
        ->assertStatus(403);
});

test('guest cannot access improvement category index page', function () {
    $this
        ->get(route('improvement-categories.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access improvement category create form', function () {
    $this
        ->get(route('improvement-categories.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access improvement category edit form', function () {
    $improvementCategory = ImprovementCategory::first();

    $this
        ->get(route('improvement-categories.edit', $improvementCategory->id))
        ->assertRedirect(route('login'));
});
