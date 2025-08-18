<?php

use App\Models\Equipment;
use App\Models\InspectionAirConditioner;
use Database\Seeders\EquipmentClassSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([EquipmentClassSeeder::class]);

    Permission::create(['name' => 'create_inspection']);
    Permission::create(['name' => 'create_inspectionairconditioner']);
    Permission::create(['name' => 'read_inspectionairconditioner']);
    Permission::create(['name' => 'update_inspectionairconditioner']);
    Permission::create(['name' => 'delete_inspectionairconditioner']);
});

test('inspection air conditioner create form should be rendered', function () {
    $inspector = createInspectorUser();

    $equipment = Equipment::factory()->create([
        'equipment_class_id' => 4,
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
    $inspectionAirConditioner->inspectionForm()->create([
        'equipment_id' => Equipment::factory()->create(['equipment_class_id' => 4])->id
    ]);

    $this->actingAs($inspector)
        ->get(route('inspectionairconditioners.edit', $inspectionAirConditioner->id))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('inspection/air-conditioner/edit'),
        );
});
