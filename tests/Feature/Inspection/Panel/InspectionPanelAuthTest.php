<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionPanel;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionPanel']);
});

test('normal user cannot access inspection panel form', function () {
    $user = createNormalUser();
    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection panel form', function () {
    $user = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection panel data', function () {
    $user = createNormalUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->post(route('inspectionpanels.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'temperature_incoming_r' => 30,
            'temperature_incoming_s' => 40,
            'temperature_incoming_t' => 50,
            'temperature_cabinet' => 60,
            'temperature_outgoing_r' => 70,
            'temperature_outgoing_s' => 80,
            'temperature_outgoing_t' => 90,
            'current_r' => 110,
            'current_s' => 220,
            'current_t' => 330,
            'inspected_by' => $user->id,
            'has_abnormality' => '0',
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection panel data', function () {
    $user = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->from(route('inspections.create', $equipment->id))
        ->post(route('inspectionpanels.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'temperature_incoming_r' => 30,
            'temperature_incoming_s' => 40,
            'temperature_incoming_t' => 50,
            'temperature_cabinet' => 60,
            'temperature_outgoing_r' => 70,
            'temperature_outgoing_s' => 80,
            'temperature_outgoing_t' => 90,
            'current_r' => 110,
            'current_s' => 220,
            'current_t' => 330,
            'inspected_by' => $user->id,
            'has_abnormality' => '0',
        ])
        ->assertStatus(302);
});

test('normal user cannot access inspection panel edit page', function () {
    $user = createNormalUser();

    $inspectionPanelData = InspectionPanel::all();
    $this->assertEmpty($inspectionPanelData);

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

    $this->actingAs($user)
        ->get(route('inspectionpanels.edit', [
            'equipment' => $equipment,
            'inspectionPanel' => $inspectionPanel->id,
        ]))
        ->assertStatus(403);
});

test('inspector user can access inspection panel edit page', function () {
    $inspector = createInspectorUser();

    $inspectionPanelData = InspectionPanel::all();
    $this->assertEmpty($inspectionPanelData);

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
            'equipment' => $equipment,
            'inspectionPanel' => $inspectionPanel->id,
        ]))
        ->assertStatus(200);
});
