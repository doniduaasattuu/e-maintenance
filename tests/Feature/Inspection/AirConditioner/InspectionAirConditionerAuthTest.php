<?php

use App\Models\Equipment;
use App\Models\InspectionAirConditioner;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionAirConditioner']);
});

test('normal user cannot access inspection air conditioner form', function () {
    $user = createNormalUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection air conditioner form', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection air conditioner data', function () {
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
    ]);

    $this->actingAs($user)
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => Arr::random([0, 1]),
            'is_clean' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $user->id,
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection air conditioner data', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
    ]);

    $this->actingAs($user)
        ->from(route('inspections.create', $equipment->id))
        ->post(route('inspectionairconditioners.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => Arr::random([0, 1]),
            'is_clean' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $user->id,
        ])
        ->assertStatus(200);
});

test('normal user cannot access inspection air conditioner edit page', function () {
    $user = createNormalUser();

    $inspectionAirConditionerData = InspectionAirConditioner::all();
    $this->assertEmpty($inspectionAirConditionerData);

    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();

    $this->actingAs($user)
        ->get(route('inspectionairconditioners.edit', $inspectionAirConditioner->id))
        ->assertStatus(403);
});

test('inspector user can access inspection air conditioner edit page', function () {
    $inspector = createInspectorUser();

    $inspectionAirConditionerData = InspectionAirConditioner::all();
    $this->assertEmpty($inspectionAirConditionerData);

    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();
    $inspectionAirConditioner->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 4])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionairconditioners.edit', $inspectionAirConditioner->id))
        ->assertStatus(200);
});
