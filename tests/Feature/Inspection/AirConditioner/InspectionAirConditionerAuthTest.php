<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionAirConditioner']);
});

test('normal user cannot access inspection air conditioner form', function () {
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection air conditioner form', function () {
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->assertNotNull($equipment);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection air conditioner data', function () {
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
    ]);

    $this->actingAs($user)
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => Arr::random([0, 1]),
            'is_clean' => Arr::random([0, 1]),
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $user->id,
            'has_abnormality' => '0',
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection air conditioner data', function () {
    $user = createInspectorUser();
    $classAc = EquipmentClass::where('formable_type', 'AC')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $classAc->id,
    ]);

    $this->actingAs($user)
        ->from(route('inspections.create', $equipment->id))
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => Arr::random([0, 1]),
            'is_clean' => Arr::random([0, 1]),
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $user->id,
            'has_abnormality' => '0',
        ])
        ->assertStatus(302);
});
