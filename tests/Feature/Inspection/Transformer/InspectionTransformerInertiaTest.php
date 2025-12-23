<?php

use App\Models\Equipment;
use App\Models\InspectionTransformer;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\QualityRatingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, QualityRatingSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionTransformer']);
});

test('inspection transformer create form should be rendered', function () {
    $inspector = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 3,
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
    $inspectionTransformer->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 3])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectiontransformers.edit', $inspectionTransformer->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/transformer/edit'),
        );
});
