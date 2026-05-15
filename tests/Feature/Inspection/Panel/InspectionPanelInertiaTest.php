<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionPanel;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionPanel']);
});

test('inspection panel create form should be rendered', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
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

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionPanel->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionpanels.edit', [
            'equipment' => $equipment->id,
            'inspectionPanel' => $inspectionPanel->id
        ]))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/panel/edit'),
        );
});
