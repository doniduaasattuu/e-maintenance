<?php

use App\Models\Equipment;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipment']);
    Permission::create(['name' => 'read_equipment']);
    Permission::create(['name' => 'update_equipment']);
    Permission::create(['name' => 'delete_equipment']);
});

test('equipment index should be rendered', function () {
    $admin = createAdminUser();
    Equipment::factory()->count(20)->create();

    $this->actingAs($admin)
        ->get(route('equipments.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment/index')
                ->has('equipments.data', 10)
                ->has('equipmentClasses.data')
                ->has('equipmentStatuses.data')
        );

    $this->actingAs($admin)
        ->get(route('equipments.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment/index')
                ->has('equipments.data', 10)
                ->has('equipmentClasses.data')
                ->has('equipmentStatuses.data')
        );
});

test('equipment create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipments.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('equipment/create')
                ->has('equipmentClasses')
                ->has('equipmentStatuses')
        );
});

test('equipment edit form should be rendered', function () {
    $admin = createAdminUser();
    $equipment = Equipment::factory()->create();

    $this->actingAs($admin)
        ->get(route('equipments.edit', $equipment->id))
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/edit')
                ->has('equipment.data')
                ->has('equipment.data.id')
                ->has('equipment.data.code')
                ->has('equipment.data.sort_field')
                ->has('equipment.data.description')
                ->has('equipment.data.functional_location_id')
                ->has('equipment.data.equipment_class_id')
                ->has('equipment.data.equipment_status_id')
        );
});
