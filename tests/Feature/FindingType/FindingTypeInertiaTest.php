<?php

use App\Models\FindingType;
use Database\Seeders\FindingTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingType']);

    $this->seed(FindingTypeSeeder::class);
});

test('finding type index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-types.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-type/index')
                ->has('findingTypes.data', 2)
        );

    $this->actingAs($admin)
        ->get(route('finding-types.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-type/index')
                ->has('findingTypes.data', 0)
        );
});

test('finding type create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-types.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-type/create'),
        );
});

test('finding type edit form should be rendered', function () {
    $admin = createAdminUser();
    $findingType = FindingType::first();

    $this->actingAs($admin)
        ->get(route('finding-types.edit', $findingType->id))
        ->assertInertia(
            fn($page) => $page
                ->component('finding-type/edit')
                ->has('findingType.data')
                ->has('findingType.data.id')
                ->has('findingType.data.name')
                ->has('findingType.data.description')
        );
});
