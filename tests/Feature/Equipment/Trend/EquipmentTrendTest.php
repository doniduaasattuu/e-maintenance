<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Database\Seeders\InspectionPanelSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function PHPUnit\Framework\assertNotNull;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Equipment', 'InspectionPanel']);

    $this->seed([
        UserSeeder::class,
        EquipmentClassSeeder::class,
        EquipmentStatusSeeder::class,
        EquipmentTypeSeeder::class,
        EquipmentSeeder::class,
        InspectionPanelSeeder::class,
    ]);
});

test('equipment trend page is accessible', function () {
    $class = EquipmentClass::where('code', 'ZCLASS_E008')->first();
    $equipment = Equipment::where('equipment_class_id', $class->id)->first();
    assertNotNull($equipment);

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.trend', $equipment->id));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/trend/panel')
                ->has('equipment.data')
                ->has('filters')
                ->has('trends.incoming')
                ->has('trends.outgoing')
                ->has('trends.cabinet')
                ->has('trends.ampere')
                ->has('configs')
        );
});

test('equipment trend page is not rendered', function () {
    $class = EquipmentClass::factory()->create();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => $class->id,
    ]);
    assertNotNull($equipment);

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.trend', $equipment->id));

    $response
        ->assertSessionHas('message', [
            'type' => 'info',
            'description' => 'This equipment does not have a trend view available.',
        ]);
});
