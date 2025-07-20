<?php

use App\Models\EquipmentClass;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipmentclass']);
    Permission::create(['name' => 'read_equipmentclass']);
    Permission::create(['name' => 'update_equipmentclass']);
    Permission::create(['name' => 'delete_equipmentclass']);

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
                ->has('equipmentClasses.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('equipment-classes.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment-class/index')
                ->has('equipmentClasses.data', 5)
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
                ->has('equipmentClass.data.formable')
                ->has('equipmentClass.data.description')
        );
});
