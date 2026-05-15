<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionTransformer;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\QualityRatingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class, QualityRatingSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionTransformer']);
});

test('inspection transformer create form should be rendered', function () {
    $inspector = createInspectorUser();

    $class = EquipmentClass::where('formable_type', 'TRANSFORMER')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    $this->actingAs($inspector)
        ->get(route('inspections.create', $equipment->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/transformer/create'),
        );
});

test('inspection transformer edit form should be rendered', function () {
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

    $this->actingAs($inspector)
        ->get(route('inspectiontransformers.edit', [
            'equipment' => $equipment->id,
            'inspectionTransformer' => $inspectionTransformer->id,
        ]))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/transformer/edit'),
        );
});
