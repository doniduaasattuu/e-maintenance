<?php

use App\Models\EquipmentType;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['EquipmentType']);

    $this->seed([
        EquipmentClassSeeder::class,
        EquipmentTypeSeeder::class
    ]);
});

test('equipment type index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-types.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-type/index')
                ->has('equipmentTypes.data', 4)
        );

    $this->actingAs($admin)
        ->get(route('equipment-types.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-type/index')
                ->has('equipmentTypes.data', 0)
        );
});

test('equipment type create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-types.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-type/create')
                ->has('equipmentClasses')
        );
});

test('equipment type edit form should be rendered', function () {
    $admin = createAdminUser();
    $equipmenttype = EquipmentType::first();

    $this->actingAs($admin)
        ->get(route('equipment-types.edit', $equipmenttype->id))
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-type/edit')
                ->has('equipmentType.data')
                ->has('equipmentClasses'),
        );
});
