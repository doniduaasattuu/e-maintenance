<?php

use App\Models\Plant;
use Database\Seeders\PlantSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Plant']);
    $this->seed([
        PlantSeeder::class,
    ]);
});

test('plant index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('plants.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('plant/index')
                ->has('plants.data', 2)
        );

    $this->actingAs($admin)
        ->get(route('plants.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('plant/index')
                ->has('plants.data', 0)
        );
});

test('plant create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('plants.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('plant/create'),
        );
});

test('plant edit form should be rendered', function () {
    $admin = createAdminUser();
    $plant = Plant::first();

    $this->actingAs($admin)
        ->get(route('plants.edit', $plant->id))
        ->assertInertia(
            fn($page) => $page
                ->component('plant/edit')
                ->has('plant.data')
                ->has('plant.data.id')
                ->has('plant.data.name')
        );
});
