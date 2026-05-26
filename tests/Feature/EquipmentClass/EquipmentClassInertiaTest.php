<?php

use App\Models\EquipmentClass;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['EquipmentClass']);

    EquipmentClass::factory()
        ->count(20)
        ->create();
});

test('equipment class index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-classes.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-class/index')
                ->has('equipmentClasses.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('equipment-classes.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-class/index')
                ->has('equipmentClasses.data', 10)
        );
});

test('equipment class create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipment-classes.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-class/create'),
        );
});

test('equipment class edit form should be rendered', function () {
    $admin = createAdminUser();
    $equipmentclass = EquipmentClass::first();

    $this->actingAs($admin)
        ->get(route('equipment-classes.edit', $equipmentclass->id))
        ->assertInertia(
            fn($page) => $page
                ->component('equipment-class/edit')
                ->has('equipmentClass.data')
                ->has('equipmentClass.data.id')
                ->has('equipmentClass.data.code')
                ->has('equipmentClass.data.formable_type')
                ->has('equipmentClass.data.description')
        );
});
