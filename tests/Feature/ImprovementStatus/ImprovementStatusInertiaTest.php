<?php

use App\Models\ImprovementStatus;
use Database\Seeders\ImprovementStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementStatus']);

    $this->seed([
        ImprovementStatusSeeder::class,
    ]);
});

test('improvement status index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('improvement-statuses.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-status/index')
                ->has('improvementStatuses.data', 5)
        );

    $this->actingAs($admin)
        ->get(route('improvement-statuses.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-status/index')
                ->has('improvementStatuses.data', 0)
        );
});

test('improvement status create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('improvement-statuses.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-status/create'),
        );
});

test('improvement status edit form should be rendered', function () {
    $admin = createAdminUser();
    $improvementStatus = ImprovementStatus::first();

    $this->actingAs($admin)
        ->get(route('improvement-statuses.edit', $improvementStatus->id))
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-status/edit')
                ->has('improvementStatus.data')
                ->has('improvementStatus.data.id')
                ->has('improvementStatus.data.name')
                ->has('improvementStatus.data.color')
                ->has('improvementStatus.data.sequence')
        );
});
