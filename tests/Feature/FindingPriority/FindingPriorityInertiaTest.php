<?php

use App\Models\FindingPriority;
use Database\Seeders\FindingPrioritySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingPriority']);

    $this->seed(FindingPrioritySeeder::class);
});

test('finding priority index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-priorities.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-priority/index')
                ->has('findingPriorities.data', 5)
        );

    $this->actingAs($admin)
        ->get(route('finding-priorities.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-priority/index')
                ->has('findingPriorities.data', 0)
        );
});

test('finding priority create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-priorities.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-priority/create'),
        );
});

test('finding priority edit form should be rendered', function () {
    $admin = createAdminUser();
    $findingPriority = FindingPriority::first();

    $this->actingAs($admin)
        ->get(route('finding-priorities.edit', $findingPriority->id))
        ->assertInertia(
            fn($page) => $page
                ->component('finding-priority/edit')
                ->has('findingPriority.data')
                ->has('findingPriority.data.id')
                ->has('findingPriority.data.label')
                ->has('findingPriority.data.sla_resolution_hours')
                ->has('findingPriority.data.description')
        );
});
