<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionMotor;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionMotor']);
});

test('normal user cannot access inspection motor form', function () {
    $user = createNormalUser();
    $class = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection motor form', function () {
    $user = createInspectorUser();
    $class = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection motor data', function () {
    $user = createNormalUser();
    $class = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
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
            'has_abnormality' => '0',
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection motor data', function () {
    $user = createInspectorUser();
    $class = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
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
            'has_abnormality' => '0',
        ])
        ->assertStatus(302);
});

test('normal user cannot access inspection motor edit page', function () {
    $user = createNormalUser();

    $inspectionMotorData = InspectionMotor::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionMotor::factory()->create();
    $class = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionMotor->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($user)
        ->get(route('inspectionmotors.edit', [
            'equipment' => $equipment->id,
            'inspectionMotor' => $inspectionMotor->id,
        ]))
        ->assertStatus(403);
});

test('inspector user can access inspection motor edit page', function () {
    $inspector = createInspectorUser();

    $inspectionMotorData = InspectionMotor::all();
    $this->assertEmpty($inspectionMotorData);

    $inspectionMotor = InspectionMotor::factory()->create();
    $classAc = EquipmentClass::where('formable_type', 'MOTOR')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionMotor->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->assertNotNull($equipment);

    $this->actingAs($inspector)
        ->get(route('inspectionmotors.edit', [
            'equipment' => $equipment->id,
            'inspectionMotor' => $inspectionMotor->id,
        ]))
        ->assertStatus(200);
});
