<?php

use App\Models\Department;
use App\Models\Division;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_division']);
    Permission::create(['name' => 'read_division']);
    Permission::create(['name' => 'update_division']);
    Permission::create(['name' => 'delete_division']);

    Division::factory()
        ->count(20)
        ->create();
});

test('division index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('divisions.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('division/index')
                ->has('divisions.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('divisions.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('division/index')
                ->has('divisions.data', 5)
        );
});

test('division create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('divisions.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('division/create'),
        );
});

test('division edit form should be rendered', function () {
    $admin = createAdminUser();
    $division = Division::first();

    $this->actingAs($admin)
        ->get(route('divisions.edit', $division->id))
        ->assertInertia(
            fn($page) => $page
                ->component('division/edit')
                ->has('division.data')
                ->has('division.data.id')
                ->has('division.data.name')
        );
});
