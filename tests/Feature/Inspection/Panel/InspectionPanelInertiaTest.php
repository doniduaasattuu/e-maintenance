<?php

use App\Models\Equipment;
use App\Models\InspectionPanel;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionPanel']);
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

    $inspectionPanel = InspectionPanel::factory()->create();
    $inspectionPanel->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 1])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionpanels.edit', $inspectionPanel->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/panel/edit'),
        );
});
