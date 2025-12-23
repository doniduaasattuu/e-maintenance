<?php

use App\Models\Equipment;
use App\Models\InspectionMotor;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionMotor']);
});

test('normal user cannot access inspection motor form', function () {
    $user = createNormalUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection motor form', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection motor data', function () {
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($user)
        ->post(route('inspectionmotors.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'number_of_greasing' => 100,
            'temperature_de' => '30',
            'temperature_body' => '40',
            'temperature_nde' => '50',
            'vibration_dev' => '0.10',
            'vibration_deh' => '0.20',
            'vibration_dea' => '0.30',
            'vibration_def' => '0.40',
            'is_noisy_de' => 0,
            'vibration_ndev' => '0.50',
            'vibration_ndeh' => '0.60',
            'vibration_ndef' => '0.70',
            'is_noisy_nde' => 0,
            'inspected_by' => $user->id,
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection motor data', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($user)
        ->from(route('inspections.create', $equipment->id))
        ->post(route('inspectionmotors.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'number_of_greasing' => 100,
            'temperature_de' => '30',
            'temperature_body' => '40',
            'temperature_nde' => '50',
            'vibration_dev' => '0.10',
            'vibration_deh' => '0.20',
            'vibration_dea' => '0.30',
            'vibration_def' => '0.40',
            'is_noisy_de' => 0,
            'vibration_ndev' => '0.50',
            'vibration_ndeh' => '0.60',
            'vibration_ndef' => '0.70',
            'is_noisy_nde' => 0,
            'inspected_by' => $user->id,
        ])
        ->assertStatus(200);
});

test('normal user cannot access inspection motor edit page', function () {
    $user = createNormalUser();

    $inspectionMotorData = InspectionMotor::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionMotor::factory()->create();

    $this->actingAs($user)
        ->get(route('inspectionmotors.edit', $inspectionMotor->id))
        ->assertStatus(403);
});

test('inspector user can access inspection motor edit page', function () {
    $inspector = createInspectorUser();

    $inspectionMotorData = InspectionMotor::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionMotor::factory()->create();
    $inspectionMotor->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 2])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionmotors.edit', $inspectionMotor->id))
        ->assertStatus(200);
});
