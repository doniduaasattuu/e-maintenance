<?php

use App\Models\Equipment;
use App\Models\InspectionMotor;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectionmotor']);
    Permission::create(['name' => 'read_inspectionmotor']);
    Permission::create(['name' => 'update_inspectionmotor']);
    Permission::create(['name' => 'delete_inspectionmotor']);
});

test('store fails validation', function () {
    $inspector = createInspectorUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $response = $this
        ->actingAs($inspector)
        ->post(route('inspectionmotors.store'), [
            'equipment_id' => $equipment->id,
            'is_operational' => 's',
            'is_clean' => 's',
            'number_of_greasing' => 'true',
            'temperature_de' => '30degC',
            'temperature_body' => '30degC',
            'temperature_nde' => '30degC',
            'vibration_dev' => '0.12mm/s',
            'vibration_deh' => '0.12mm/s',
            'vibration_dea' => '0.12mm/s',
            'vibration_def' => '0.12mm/s',
            'is_noisy_de' => 'noise',
            'vibration_ndev' => '0.50mm/s',
            'vibration_ndeh' => '0.60mm/s',
            'vibration_ndef' => '0.70mm/s',
            'is_noisy_nde' => 'noise',
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasErrors([
        'is_operational' => 'The is operational field must be true or false.',
        'is_clean' => 'The is clean field must be true or false.',
        'number_of_greasing' => 'The number of greasing field must be a number.',
        'temperature_de' =>  'The temperature de field must be a number.',
        'temperature_body' =>  'The temperature body field must be a number.',
        'temperature_nde' =>  'The temperature nde field must be a number.',
        'vibration_dev' => 'The vibration dev field must be a number.',
        'vibration_deh' => 'The vibration deh field must be a number.',
        'vibration_dea' => 'The vibration dea field must be a number.',
        'vibration_def' => 'The vibration def field must be a number.',
        'is_noisy_de' => 'The is noisy de field must be true or false.',
        'vibration_ndev' => 'The vibration ndev field must be a number.',
        'vibration_ndeh' => 'The vibration ndeh field must be a number.',
        'vibration_ndef' => 'The vibration ndef field must be a number.',
        'is_noisy_nde' => 'The is noisy nde field must be true or false.',
    ]);
});

test('store success validation', function () {
    $inspector = createInspectorUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $response = $this
        ->actingAs($inspector)
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
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_clean',
        'number_of_greasing',
        'temperature_de',
        'temperature_body',
        'temperature_nde',
        'vibration_dev',
        'vibration_deh',
        'vibration_dea',
        'vibration_def',
        'is_noisy_de',
        'vibration_ndev',
        'vibration_ndeh',
        'vibration_ndef',
    ]);
});

test('update fails validation', function () {
    $inspector = createInspectorUser();
    $inspectionMotor = InspectionMotor::factory()->create();

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionmotors.update', $inspectionMotor->id), [
            'is_operational' => 's',
            'is_clean' => 's',
            'number_of_greasing' => 'true',
            'temperature_de' => '30degC',
            'temperature_body' => '30degC',
            'temperature_nde' => '30degC',
            'vibration_dev' => '0.12mm/s',
            'vibration_deh' => '0.12mm/s',
            'vibration_dea' => '0.12mm/s',
            'vibration_def' => '0.12mm/s',
            'is_noisy_de' => 'noise',
            'vibration_ndev' => '0.50mm/s',
            'vibration_ndeh' => '0.60mm/s',
            'vibration_ndef' => '0.70mm/s',
            'is_noisy_nde' => 'noise',
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasErrors([
        'is_operational',
        'is_clean',
        'number_of_greasing',
        'temperature_de',
        'temperature_body',
        'temperature_nde',
        'vibration_dev',
        'vibration_deh',
        'vibration_dea',
        'vibration_def',
        'is_noisy_de',
        'vibration_ndev',
        'vibration_ndeh',
        'vibration_ndef',
        'is_noisy_nde',
    ]);
});

test('update inspection motor success validation', function () {
    $inspector = createInspectorUser();
    $inspectionMotor = InspectionMotor::factory()->create();

    $response = $this
        ->actingAs($inspector)
        ->patch(route('inspectionmotors.update', $inspectionMotor->id), [
            'is_operational' => 0,
            'is_clean' => 0,
            'number_of_greasing' => 91,
            'temperature_de' => '31',
            'temperature_body' => '41',
            'temperature_nde' => '51',
            'vibration_dev' => '0.11',
            'vibration_deh' => '0.21',
            'vibration_dea' => '0.31',
            'vibration_def' => '0.41',
            'is_noisy_de' => 1,
            'vibration_ndev' => '0.51',
            'vibration_ndeh' => '0.61',
            'vibration_ndef' => '0.71',
            'is_noisy_nde' => 1,
            'inspected_by' => $inspector->id,
        ]);

    $response->assertSessionHasNoErrors([
        'is_operational',
        'is_clean',
        'number_of_greasing',
        'temperature_de',
        'temperature_body',
        'temperature_nde',
        'vibration_dev',
        'vibration_deh',
        'vibration_dea',
        'vibration_def',
        'is_noisy_de',
        'vibration_ndev',
        'vibration_ndeh',
        'vibration_ndef',
        'is_noisy_nde',
    ]);

    $inspectionMotor->refresh();
    expect($inspectionMotor->is_operational)->toBe(0);
    expect($inspectionMotor->is_clean)->toBe(0);
    expect($inspectionMotor->number_of_greasing)->toBe(91,);
    expect($inspectionMotor->temperature_de)->toBe(31);
    expect($inspectionMotor->temperature_body)->toBe(41);
    expect($inspectionMotor->temperature_nde)->toBe(51);
    expect($inspectionMotor->vibration_dev)->toBe(0.11);
    expect($inspectionMotor->vibration_deh)->toBe(0.21);
    expect($inspectionMotor->vibration_dea)->toBe(0.31);
    expect($inspectionMotor->vibration_def)->toBe(0.41);
    expect($inspectionMotor->is_noisy_de)->toBe(1);
    expect($inspectionMotor->vibration_ndev)->toBe(0.51);
    expect($inspectionMotor->vibration_ndeh)->toBe(0.61);
    expect($inspectionMotor->vibration_ndef)->toBe(0.71);
    expect($inspectionMotor->is_noisy_nde)->toBe(1);
    expect($inspectionMotor->inspected_by)->toBe($inspector->id);
});
