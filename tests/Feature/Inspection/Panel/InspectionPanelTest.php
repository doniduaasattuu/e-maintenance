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

test('store fails validation', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectionpanels.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 's',
            'is_clean' => 'g',
            'temperature_incoming_r' => 's',
            'temperature_incoming_s' => 's',
            'temperature_incoming_t' => 's',
            'temperature_cabinet' => 's',
            'temperature_outgoing_r' => 's',
            'temperature_outgoing_s' => 's',
            'temperature_outgoing_t' => 's',
            'current_r' => 's',
            'current_s' => 's',
            'current_t' => 's',
            'inspected_by' => 's',
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_clean',
        'temperature_incoming_r',
        'temperature_incoming_s',
        'temperature_incoming_t',
        'temperature_cabinet',
        'temperature_outgoing_r',
        'temperature_outgoing_s',
        'temperature_outgoing_t',
        'current_r',
        'current_s',
        'current_t',
        'inspected_by',
    ]);
});

test('store success validation', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'PANEL')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
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
            'inspected_by' => $inspector->id,
            'has_abnormality' => '0',
        ]);

    $response->assertSessionHasNoErrors([
        'equipment_id',
        'is_operational',
        'is_clean',
        'temperature_incoming_r',
        'temperature_incoming_s',
        'temperature_incoming_t',
        'temperature_cabinet',
        'temperature_outgoing_r',
        'temperature_outgoing_s',
        'temperature_outgoing_t',
        'current_r',
        'current_s',
        'current_t',
        'inspected_by',
    ]);
});

test('update fails validation', function () {
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

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionpanels.update', [
            'equipment' => $equipment->id,
            'inspectionPanel' => $inspectionPanel->id,
        ]), [
            'is_operational' => 's',
            'is_clean' => 'g',
            'temperature_incoming_r' => 's',
            'temperature_incoming_s' => 's',
            'temperature_incoming_t' => 's',
            'temperature_cabinet' => 's',
            'temperature_outgoing_r' => 's',
            'temperature_outgoing_s' => 's',
            'temperature_outgoing_t' => 's',
            'current_r' => 's',
            'current_s' => 's',
            'current_t' => 's',
            'inspected_by' => 's',
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_clean',
        'temperature_incoming_r',
        'temperature_incoming_s',
        'temperature_incoming_t',
        'temperature_cabinet',
        'temperature_outgoing_r',
        'temperature_outgoing_s',
        'temperature_outgoing_t',
        'current_r',
        'current_s',
        'current_t',
        'inspected_by',
    ]);
});

test('update inspection panel success validation', function () {
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

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionpanels.update', [
            'equipment' => $equipment->id,
            'inspectionPanel' => $inspectionPanel->id,
        ]), [
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
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_clean',
        'temperature_incoming_r',
        'temperature_incoming_s',
        'temperature_incoming_t',
        'temperature_cabinet',
        'temperature_outgoing_r',
        'temperature_outgoing_s',
        'temperature_outgoing_t',
        'current_r',
        'current_s',
        'current_t',
        'inspected_by',
    ]);

    $inspectionPanel->refresh();
    expect($inspectionPanel->is_operational)->toBe(1);
    expect($inspectionPanel->is_clean)->toBe(1);
    expect($inspectionPanel->temperature_incoming_r)->toBe(30);
    expect($inspectionPanel->temperature_incoming_s)->toBe(40);
    expect($inspectionPanel->temperature_incoming_t)->toBe(50);
    expect($inspectionPanel->temperature_cabinet)->toBe(60);
    expect($inspectionPanel->temperature_outgoing_r)->toBe(70);
    expect($inspectionPanel->temperature_outgoing_s)->toBe(80);
    expect($inspectionPanel->temperature_outgoing_t)->toBe(90);
    expect($inspectionPanel->current_r)->toBe(110);
    expect($inspectionPanel->current_s)->toBe(220);
    expect($inspectionPanel->current_t)->toBe(330);
    expect($inspectionPanel->inspected_by)->toBe($inspector->id);
});
