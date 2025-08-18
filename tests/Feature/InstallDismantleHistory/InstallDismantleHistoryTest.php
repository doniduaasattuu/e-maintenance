<?php

use App\Models\Equipment;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use Database\Seeders\InstallDismantleHistorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_installdismantlehistory']);
    Permission::create(['name' => 'read_installdismantlehistory']);
    Permission::create(['name' => 'update_installdismantlehistory']);
    Permission::create(['name' => 'delete_installdismantlehistory']);
});

test('install dismantle index page accessible', function () {
    $this->seed(InstallDismantleHistorySeeder::class);

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipment-histories.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('install-dismantle/index')
                ->has('histories.data', 10)
        );
});

test('equipment history page accessible', function () {
    $this->seed(InstallDismantleHistorySeeder::class);

    $equipment = Equipment::factory([
        'equipment_status_id' => EquipmentStatus::factory()->create()->id
    ])->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.history', $equipment->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/history')
                ->has('histories.data', 0)
                ->has('equipment')
        );

    $equipment->update([
        'functional_location_id' => FunctionalLocation::factory()->create()->id,
        'equipment_status_id' => EquipmentStatus::factory()->create()->id,
    ]);

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.history', $equipment->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/history')
                ->has('histories.data', 1)
                ->has('equipment')
        );
});
