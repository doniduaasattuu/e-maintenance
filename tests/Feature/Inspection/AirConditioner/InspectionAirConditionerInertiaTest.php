<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentInspectionForm;
use App\Models\EquipmentStatus;
use App\Models\InspectionAirConditioner;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class, EquipmentStatusSeeder::class]);

    $this->generatePermissions(['Inspection', 'InspectionAirConditioner']);
});

test('inspection air conditioner create form should be rendered', function () {
    $inspector = createInspectorUser();

    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();
    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAirConditioner->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($inspector)
        ->get(route('inspections.create', $equipment->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/air-conditioner/create'),
        );
});

test('inspection air conditioner edit form should be rendered', function () {
    $inspector = createInspectorUser();

    $inspectionAirConditioner = InspectionAirConditioner::factory()->create();
    $class = EquipmentClass::where('formable_type', 'AC')->first();
    $status = EquipmentStatus::where('code', 'INST')->first();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
        'equipment_status_id' => $status->id,
    ]);

    EquipmentInspectionForm::create([
        'equipment_id' => $equipment->id,
        'formable_id' => $inspectionAirConditioner->id,
        'formable_type' => $equipment->eclass->formable_type
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionairconditioners.edit', [
            'equipment' => $equipment->id,
            'inspectionAirConditioner' =>  $inspectionAirConditioner->id,
        ]))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/air-conditioner/edit'),
        );
});
