<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionAirConditioner;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionAirConditioner']);
});

test('store fails validation', function () {
    $inspector = createInspectorUser();
    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 's',
            'is_drain_leaking' => 's',
            'current_load' => 's',
            'blowing_temperature' => 's',
            'ambient_temperature' => 's',
            'is_filter_clean' => 's',
            'is_evaporator_clean' => 's',
            'is_condensor_clean' => 's',
            'inspected_by' => $inspector->id,
            'has_abnormality' => '0',
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_drain_leaking',
        'current_load',
        'blowing_temperature',
        'ambient_temperature',
        'is_filter_clean',
        'is_evaporator_clean',
        'is_condensor_clean',
    ]);
});

test('store success validation', function () {
    $inspector = createInspectorUser();
    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => Arr::random([0, 1]),
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $inspector->id,
            'has_abnormality' => '0',
        ]);

    $response->assertSessionHasNoErrors([
        'equipment_id',
        'is_operational',
        'is_drain_leaking',
        'current_load',
        'blowing_temperature',
        'ambient_temperature',
        'is_filter_clean',
        'is_evaporator_clean',
        'is_condensor_clean',
        'inspected_by',
    ]);
});

test('update fails validation', function () {
    $inspector = createInspectorUser();
    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAirConditioner->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->assertNotNull($equipment);

    $response = $this
        ->actingAs($inspector)
        ->patch(route(
            'inspectionairconditioners.update',
            [
                'equipment' => $equipment->id,
                'inspectionAirConditioner' => $inspectionAirConditioner->id,
            ]
        ), [
            'is_operational' => 's',
            'is_drain_leaking' => 's',
            'current_load' => 's',
            'blowing_temperature' => 's',
            'ambient_temperature' => 's',
            'is_filter_clean' => 's',
            'is_evaporator_clean' => 's',
            'is_condensor_clean' => 's',
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_drain_leaking',
        'current_load',
        'blowing_temperature',
        'ambient_temperature',
        'is_filter_clean',
        'is_evaporator_clean',
        'is_condensor_clean',
    ]);
});

test('update inspection air conditioner success validation', function () {
    $inspector = createInspectorUser();
    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAirConditioner->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->assertNotNull($equipment);

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionairconditioners.update', [
            'equipment' => $equipment->id,
            'inspectionAirConditioner' => $inspectionAirConditioner->id,
        ]), [
            'is_operational' => Arr::random([0, 1]),
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $inspector->id,
            'has_abnormality' => '0',
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_drain_leaking',
        'current_load',
        'blowing_temperature',
        'ambient_temperature',
        'is_filter_clean',
        'is_evaporator_clean',
        'is_condensor_clean',
    ]);
});

test('normal user cannot access inspection ac edit page', function () {
    $user = createNormalUser();

    $inspectionAcData = InspectionAirConditioner::all();
    $this->assertEmpty($inspectionAcData);

    $inspectionAc = InspectionAirConditioner::factory()->create();

    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAc->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($user)
        ->get(route('inspectionairconditioners.edit', [
            'equipment' => $equipment,
            'inspectionAirConditioner' => $inspectionAc->id,
        ]))
        ->assertStatus(403);
});

test('inspector user can access inspection ac edit page', function () {
    $inspector = createInspectorUser();

    $inspectionAcData = InspectionAirConditioner::all();
    $this->assertEmpty($inspectionAcData);

    $inspectionAc = InspectionAirConditioner::factory()->create();

    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAc->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionairconditioners.edit', [
            'equipment' => $equipment,
            'inspectionAirConditioner' => $inspectionAc->id,
        ]))
        ->assertStatus(200);
});
