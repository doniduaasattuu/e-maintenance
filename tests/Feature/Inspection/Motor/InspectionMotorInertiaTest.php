<?php

use App\Models\Equipment;
use App\Models\InspectionMotor;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectionmotor']);
    Permission::create(['name' => 'read_inspectionmotor']);
    Permission::create(['name' => 'update_inspectionmotor']);
    Permission::create(['name' => 'delete_inspectionmotor']);
});

test('inspection motor create form should be rendered', function () {
    $inspector = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($inspector)
        ->get(route('inspections.create', $equipment->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/motor/create'),
        );
});

test('inspection motor edit form should be rendered', function () {
    $inspector = createInspectorUser();

    $inspectionMotor = InspectionMotor::factory()->create();

    $this->actingAs($inspector)
        ->get(route('inspectionmotors.edit', $inspectionMotor->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/motor/edit'),
        );
});
