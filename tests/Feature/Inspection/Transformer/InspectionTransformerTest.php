<?php

use App\Models\Equipment;
use App\Models\InspectionTransformer;
use App\Models\QualityRating;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Arr;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, QualityRatingSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectiontransformer']);
    Permission::create(['name' => 'read_inspectiontransformer']);
    Permission::create(['name' => 'update_inspectiontransformer']);
    Permission::create(['name' => 'delete_inspectiontransformer']);
});

test('store fails validation', function () {
    $inspector = createInspectorUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
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
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
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

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectiontransformers.update', $inspectionTransformer->id), [
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

    $response = $this
        ->from(route('inspectiontransformers.edit', $inspectionTransformer->id))
        ->actingAs($inspector)
        ->patch(route('inspectiontransformers.update', $inspectionTransformer->id), [
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
