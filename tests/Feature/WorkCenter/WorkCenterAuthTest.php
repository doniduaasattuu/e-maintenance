<?php

use App\Models\WorkCenter;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_workcenter']);
    Permission::create(['name' => 'read_workcenter']);
    Permission::create(['name' => 'update_workcenter']);
    Permission::create(['name' => 'delete_workcenter']);

    WorkCenter::factory()->count(20)->create();
});

test('normal user cannot access work center index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('work-centers.index'))
        ->assertStatus(403);
});

test('normal user cannot access work center create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('work-centers.create'))
        ->assertStatus(403);
});

test('normal user cannot access work center edit form', function () {
    $user = createNormalUser();
    $workcenter = WorkCenter::first();

    $this->actingAs($user)
        ->get(route('work-centers.edit', $workcenter))
        ->assertStatus(403);
});

test('guest cannot access work center index page', function () {
    $this
        ->get(route('work-centers.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access work center create form', function () {
    $this
        ->get(route('work-centers.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access work center edit form', function () {
    $workcenter = WorkCenter::first();

    $this
        ->get(route('work-centers.edit', $workcenter->id))
        ->assertRedirect(route('login'));
});
