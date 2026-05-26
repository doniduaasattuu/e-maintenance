<?php

use App\Models\Division;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Division']);

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
                ->has('divisions.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('divisions.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('division/index')
                ->has('divisions.data', 10)
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
