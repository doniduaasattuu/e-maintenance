<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionTransformer;
use App\Models\QualityRating;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class, QualityRatingSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionTransformer']);
});

test('store fails validation', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'TRANSFORMER')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectiontransformers.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 's',
            'is_clean' => 's',
            'primary_current_r' => 's',
            'primary_current_s' => 's',
            'primary_current_t' => 's',
            'primary_voltage_r' => 's',
            'primary_voltage_s' => 's',
            'primary_voltage_t' => 's',
            'secondary_current_r' => 's',
            'secondary_current_s' => 's',
            'secondary_current_t' => 's',
            'secondary_voltage_r' => 's',
            'secondary_voltage_s' => 's',
            'secondary_voltage_t' => 's',
            'temperature_oil' => 's',
            'temperature_winding' => 's',
            'desicant_level_id' => 's',
            'inspected_by' => 's',
            'has_abnormality' => '0'
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_clean',
        'primary_current_r',
        'primary_current_s',
        'primary_current_t',
        'primary_voltage_r',
        'primary_voltage_s',
        'primary_voltage_t',
        'secondary_current_r',
        'secondary_current_s',
        'secondary_current_t',
        'secondary_voltage_r',
        'secondary_voltage_s',
        'secondary_voltage_t',
        'temperature_oil',
        'temperature_winding',
        'desicant_level_id',
        'inspected_by',
    ]);
});

test('store success validation', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'TRANSFORMER')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectiontransformers.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 1,
            'is_clean' => 1,
            'primary_current_r' => 150,
            'primary_current_s' => 150,
            'primary_current_t' => 150,
            'primary_voltage_r' => 20000,
            'primary_voltage_s' => 20000,
            'primary_voltage_t' => 20000,
            'secondary_current_r' => 2500,
            'secondary_current_s' => 2500,
            'secondary_current_t' => 2500,
            'secondary_voltage_r' => 400,
            'secondary_voltage_s' => 400,
            'secondary_voltage_t' => 400,
            'temperature_oil' => 55,
            'temperature_winding' => 66,
            'desicant_level_id' => 1,
            'inspected_by' => $inspector->id,
            'has_abnormality' => '0',
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_clean',
        'primary_current_r',
        'primary_current_s',
        'primary_current_t',
        'primary_voltage_r',
        'primary_voltage_s',
        'primary_voltage_t',
        'secondary_current_r',
        'secondary_current_s',
        'secondary_current_t',
        'secondary_voltage_r',
        'secondary_voltage_s',
        'secondary_voltage_t',
        'temperature_oil',
        'temperature_winding',
        'desicant_level_id',
        'inspected_by',
    ]);
});

test('update fails validation', function () {
    $inspector = createInspectorUser();
    $inspectionTransformer = InspectionTransformer::factory()->create();

    $class = EquipmentClass::where('formable_type', 'TRANSFORMER')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionTransformer->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectiontransformers.update', [
            'equipment' => $equipment->id,
            'inspectionTransformer' => $inspectionTransformer->id
        ]), [
            'is_operational' => 's',
            'is_clean' => 'g',
            'primary_current_r' => 's',
            'primary_current_s' => 's',
            'primary_current_t' => 's',
            'primary_voltage_r' => 's',
            'primary_voltage_s' => 's',
            'primary_voltage_t' => 's',
            'secondary_current_r' => 's',
            'secondary_current_s' => 's',
            'secondary_current_t' => 's',
            'secondary_voltage_r' => 's',
            'secondary_voltage_s' => 's',
            'secondary_voltage_t' => 's',
            'temperature_oil' => 's',
            'temperature_winding' => 's',
            'desicant_level_id' => 's',
            'inspected_by' => 's',
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_clean',
        'primary_current_r',
        'primary_current_s',
        'primary_current_t',
        'primary_voltage_r',
        'primary_voltage_s',
        'primary_voltage_t',
        'secondary_current_r',
        'secondary_current_s',
        'secondary_current_t',
        'secondary_voltage_r',
        'secondary_voltage_s',
        'secondary_voltage_t',
        'temperature_oil',
        'temperature_winding',
        'desicant_level_id',
        'inspected_by',
    ]);
});

test('update inspection transformer success validation', function () {
    $inspector = createInspectorUser();
    $inspectionTransformer = InspectionTransformer::factory()->create();

    $class = EquipmentClass::where('formable_type', 'TRANSFORMER')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionTransformer->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $response = $this
        ->from(route('inspectiontransformers.edit', [
            'equipment' => $equipment->id,
            'inspectionTransformer' => $inspectionTransformer->id
        ]))
        ->actingAs($inspector)
        ->patch(route('inspectiontransformers.update', [
            'equipment' => $equipment->id,
            'inspectionTransformer' => $inspectionTransformer->id
        ]), [
            'is_operational' => 1,
            'is_clean' => 1,
            'primary_current_r' => 150,
            'primary_current_s' => 150,
            'primary_current_t' => 150,
            'primary_voltage_r' => 20000,
            'primary_voltage_s' => 20000,
            'primary_voltage_t' => 20000,
            'secondary_current_r' => 2500,
            'secondary_current_s' => 2500,
            'secondary_current_t' => 2500,
            'secondary_voltage_r' => 400,
            'secondary_voltage_s' => 400,
            'secondary_voltage_t' => 400,
            'temperature_oil' => 55,
            'temperature_winding' => 66,
            'desicant_level_id' => QualityRating::all()->random()->id,
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_clean',
        'primary_current_r',
        'primary_current_s',
        'primary_current_t',
        'primary_voltage_r',
        'primary_voltage_s',
        'primary_voltage_t',
        'secondary_current_r',
        'secondary_current_s',
        'secondary_current_t',
        'secondary_voltage_r',
        'secondary_voltage_s',
        'secondary_voltage_t',
        'temperature_oil',
        'temperature_winding',
        'desicant_level_id',
        'inspected_by',
    ]);
});
