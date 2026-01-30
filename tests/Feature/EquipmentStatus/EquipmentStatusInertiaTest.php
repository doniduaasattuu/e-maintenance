<?php

use App\Models\EquipmentStatus;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['EquipmentStatus']);

    EquipmentStatus::factory()
        ->count(20)
        ->create();
});

test('equipment status index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-statuses.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-status/index')
                ->has('equipmentStatuses.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('equipment-statuses.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-status/index')
                ->has('equipmentStatuses.data', 5)
        );
});

test('equipment status create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-statuses.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-status/create'),
        );
});

test('equipment status edit form should be rendered', function () {
    $admin = createAdminUser();
    $equipmentStatus = EquipmentStatus::first();

    $this->actingAs($admin)
        ->get(route('equipment-statuses.edit', $equipmentStatus->id))
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-status/edit')
                ->has('equipmentStatus.data')
                ->has('equipmentStatus.data.id')
                ->has('equipmentStatus.data.code')
                ->has('equipmentStatus.data.description')
        );
});
