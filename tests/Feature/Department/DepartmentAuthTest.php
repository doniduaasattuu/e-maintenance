<?php

use App\Models\Department;
use App\Models\Division;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {

    $this->generatePermissions(['Department', 'Division']);

    Department::factory()
        ->count(20)
        ->has(Division::factory())
        ->create();

    Division::factory()->count(5)->create();
});

test('normal user cannot access department index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('departments.index'))
        ->assertStatus(403);
});

test('normal user cannot access department create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('departments.create'))
        ->assertStatus(403);
});

test('normal user cannot access department edit form', function () {
    $user = createNormalUser();
    $department = Department::first();

    $this->actingAs($user)
        ->get(route('departments.edit', $department))
        ->assertStatus(403);
});

test('guest cannot access department index page', function () {
    $this
        ->get(route('departments.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access department create form', function () {
    $this
        ->get(route('departments.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access department edit form', function () {
    $department = Department::first();

    $this
        ->get(route('departments.edit', $department->id))
        ->assertRedirect(route('login'));
});
