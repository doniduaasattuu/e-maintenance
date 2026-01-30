<?php

use App\Models\Equipment;
use App\Models\InspectionAirConditioner;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionAirConditioner']);
});

test('store fails validation', function () {
    $inspector = createInspectorUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
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
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
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

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionairconditioners.update', $inspectionAirConditioner->id), [
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

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionairconditioners.update', $inspectionAirConditioner->id), [
            'is_operational' => Arr::random([0, 1]),
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(0, 30),
            'blowing_temperature' => fake()->numberBetween(10, 16),
            'ambient_temperature' => fake()->numberBetween(25, 34),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
            'inspected_by' => $inspector->id,
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

    // $inspectionAirConditioner->refresh();
    // expect($inspectionAirConditioner->is_operational)->toBe(0);
    // expect($inspectionAirConditioner->is_drain_leaking)->toBe(0);
    // expect($inspectionAirConditioner->number_of_greasing)->toBe(91,);
    // expect($inspectionAirConditioner->temperature_de)->toBe(31);
    // expect($inspectionAirConditioner->temperature_body)->toBe(41);
    // expect($inspectionAirConditioner->temperature_nde)->toBe(51);
    // expect($inspectionAirConditioner->vibration_dev)->toBe(0.11);
    // expect($inspectionAirConditioner->vibration_deh)->toBe(0.21);
    // expect($inspectionAirConditioner->vibration_dea)->toBe(0.31);
    // expect($inspectionAirConditioner->vibration_def)->toBe(0.41);
    // expect($inspectionAirConditioner->is_noisy_de)->toBe(1);
    // expect($inspectionAirConditioner->vibration_ndev)->toBe(0.51);
    // expect($inspectionAirConditioner->vibration_ndeh)->toBe(0.61);
    // expect($inspectionAirConditioner->vibration_ndef)->toBe(0.71);
    // expect($inspectionAirConditioner->is_noisy_nde)->toBe(1);
    // expect($inspectionAirConditioner->inspected_by)->toBe($inspector->id);
});
