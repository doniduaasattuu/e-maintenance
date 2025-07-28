<?php

use App\Models\Equipment;
use App\Models\InspectionPanel;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectionpanel']);
    Permission::create(['name' => 'read_inspectionpanel']);
    Permission::create(['name' => 'update_inspectionpanel']);
    Permission::create(['name' => 'delete_inspectionpanel']);
});

test('inspection panel create form should be rendered', function () {
    $inspector = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 1,
    ]);

    $this->actingAs($inspector)
        ->get(route('inspections.create', $equipment->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/panel/create'),
        );
});

test('inspection panel edit form should be rendered', function () {
    $inspector = createInspectorUser();

    $inspectionMotor = InspectionPanel::factory()->create();

    $this->actingAs($inspector)
        ->get(route('inspectionpanels.edit', $inspectionMotor->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/panel/edit'),
        );
});
