<?php

use App\Models\FunctionalLocation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FunctionalLocation']);

    FunctionalLocation::factory()
        ->count(20)
        ->create();
});

test('functional location index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('functional-locations.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('functional-location/index')
                ->has('functionalLocations.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('functional-locations.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('functional-location/index')
                ->has('functionalLocations.data', 10)
        );
});

test('functional location create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('functional-locations.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('functional-location/create'),
        );
});

test('functional location edit form should be rendered', function () {
    $admin = createAdminUser();
    $functionallocation = FunctionalLocation::first();

    $this->actingAs($admin)
        ->get(route('functional-locations.edit', $functionallocation->id))
        ->assertInertia(
            fn($page) => $page
                ->component('functional-location/edit')
                ->has('functionalLocation.data')
                ->has('functionalLocation.data.id')
                ->has('functionalLocation.data.code')
                ->has('functionalLocation.data.description')
        );
});
