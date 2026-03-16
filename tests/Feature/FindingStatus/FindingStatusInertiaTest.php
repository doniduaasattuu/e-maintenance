<?php

use App\Models\FindingStatus;
use Database\Seeders\FindingStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingStatus']);

    $this->seed(FindingStatusSeeder::class);
});

test('finding status index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-statuses.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-status/index')
                ->has('findingStatuses.data', 5)
        );

    $this->actingAs($admin)
        ->get(route('finding-statuses.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-status/index')
                ->has('findingStatuses.data', 0)
        );
});

test('finding status create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-statuses.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-status/create'),
        );
});

test('finding status edit form should be rendered', function () {
    $admin = createAdminUser();
    $findingStatus = FindingStatus::first();

    $this->actingAs($admin)
        ->get(route('finding-statuses.edit', $findingStatus->id))
        ->assertInertia(
            fn($page) => $page
                ->component('finding-status/edit')
                ->has('findingStatus.data')
                ->has('findingStatus.data.id')
                ->has('findingStatus.data.name')
                ->has('findingStatus.data.description')
        );
});
