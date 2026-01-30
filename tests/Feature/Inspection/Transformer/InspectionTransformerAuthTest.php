<?php

use App\Models\Equipment;
use App\Models\InspectionTransformer;
use App\Models\QualityRating;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\QualityRatingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, QualityRatingSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionTransformer']);
});

test('normal user cannot access inspection transformer form', function () {
    $user = createNormalUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(403);
});

test('inspector user can access inspection transformer form', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
    ]);

    $this->actingAs($user)
        ->get(route('inspections.create', $equipment->id))
        ->assertStatus(200);
});

test('normal user cannot store inspection transformer data', function () {
    $user = createNormalUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
    ]);

    $this->actingAs($user)
        ->post(route('inspectiontransformers.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'primary_current_r' => 130,
            'primary_current_s' => 130,
            'primary_current_t' => 130,
            'primary_voltage_r' => 20000,
            'primary_voltage_s' => 20000,
            'primary_voltage_t' => 20000,
            'secondary_current_r' => 2500,
            'secondary_current_s' => 2500,
            'secondary_current_t' => 2500,
            'secondary_voltage_r' => 400,
            'secondary_voltage_s' => 400,
            'secondary_voltage_t' => 400,
            'temperature_oil' => 30,
            'temperature_winding' => 40,
            'inspected_by' => $user->id,
        ])
        ->assertStatus(403);
});

test('inspector user can store inspection transformer data', function () {
    $user = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
    ]);

    $qualityRating = QualityRating::all()->first();

    $this->actingAs($user)
        ->from(route('inspections.create', $equipment->id))
        ->post(route('inspectiontransformers.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'primary_current_r' => 130,
            'primary_current_s' => 130,
            'primary_current_t' => 130,
            'primary_voltage_r' => 20000,
            'primary_voltage_s' => 20000,
            'primary_voltage_t' => 20000,
            'secondary_current_r' => 2500,
            'secondary_current_s' => 2500,
            'secondary_current_t' => 2500,
            'secondary_voltage_r' => 400,
            'secondary_voltage_s' => 400,
            'secondary_voltage_t' => 400,
            'temperature_oil' => 30,
            'temperature_winding' => 40,
            'desicant_level_id' => $qualityRating->id,
            'inspected_by' => $user->id,
        ])
        ->assertStatus(200);
});

test('normal user cannot access inspection transformer edit page', function () {
    $user = createNormalUser();

    $inspectionTransformerData = InspectionTransformer::all();
    $this->assertEmpty($inspectionTransformerData);

    $inspectionTransformer = InspectionTransformer::factory()->create();

    $this->actingAs($user)
        ->get(route('inspectiontransformers.edit', $inspectionTransformer->id))
        ->assertStatus(403);
});

test('inspector user can access inspection transformer edit page', function () {
    $inspector = createInspectorUser();

    $inspectionTransformerData = InspectionTransformer::all();
    $this->assertEmpty($inspectionTransformerData);

    $inspectionTransformer = InspectionTransformer::factory()->create();
    $inspectionTransformer->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 3])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectiontransformers.edit', $inspectionTransformer->id))
        ->assertStatus(200);
});
