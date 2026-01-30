<?php

use App\Models\Equipment;
use App\Models\InspectionMotor;
use Database\Seeders\EquipmentClassSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionMotor']);
});

test('inspection motor create form should be rendered', function () {
    $inspector = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 2,
    ]);

    $this->actingAs($inspector)
        ->get(route('inspections.create', $equipment->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/motor/create'),
        );
});

test('inspection motor edit form should be rendered', function () {
    $inspector = createInspectorUser();

    $inspectionMotor = InspectionMotor::factory()->create();
    $inspectionMotor->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 2])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionmotors.edit', $inspectionMotor->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/motor/edit'),
        );
});
