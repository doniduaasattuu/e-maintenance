<?php

use App\Models\Equipment;
use App\Models\InspectionPanel;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectionpanel']);
    Permission::create(['name' => 'read_inspectionpanel']);
    Permission::create(['name' => 'update_inspectionpanel']);
    Permission::create(['name' => 'delete_inspectionpanel']);
});

test('normal user cannot access inspection panel form', function () {
    $user = createNormalUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 1,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection panel form', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 1,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection panel data', function () {
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 1,
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
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection panel data', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 1,
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
        ])
        ->assertStatus(200);
});

test('normal user cannot access inspection panel edit page', function () {
    $user = createNormalUser();

    $inspectionMotorData = InspectionPanel::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionPanel::factory()->create();

    $this->actingAs($user)
        ->get(route('inspectionpanels.edit', $inspectionMotor->id))
        ->assertStatus(403);
});

test('inspector user can access inspection panel edit page', function () {
    $inspector = createInspectorUser();

    $inspectionMotorData = InspectionPanel::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionPanel::factory()->create();

    $this->actingAs($inspector)
        ->get(route('inspectionpanels.edit', $inspectionMotor->id))
        ->assertStatus(200);
});
