<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use App\Models\User;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

use function Pest\Laravel\assertDatabaseHas;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_equipment']);
    Permission::create(['name' => 'read_equipment']);
    Permission::create(['name' => 'update_equipment']);
    Permission::create(['name' => 'delete_equipment']);
});

test('equipment index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/index')
        );
});

test('create equipment page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('equipment/create')
        );
});

test('show equipment page accessible', function () {
    $equipment = Equipment::factory()->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.show', $equipment->id));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/show')
                ->has('equipment.data')
                ->has('equipment.data.functionalLocation')
                ->has('equipment.data.equipmentStatus')
                ->has('equipment.data.equipmentStatus')
        );
});

test('store equipment successfully', function () {
    $functionalLocation = FunctionalLocation::factory()->create();
    $equipmentClass = EquipmentClass::factory()->create();
    $equipmentStatus = EquipmentStatus::factory()->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('equipments.create'))
        ->post(route('equipments.store'), [
            'code' => 'EMO123456',
            'sort_field' => 'PM3.VACUUM.M-CLEAN',
            'description' => 'AC MOTOR;380V;4P;1500RPM;40A',
            'functional_location_id' => $functionalLocation->id,
            'equipment_class_id' => $equipmentClass->id,
            'equipment_status_id' => $equipmentStatus->id
        ]);

    $response
        ->assertRedirect(route('equipments.create'));

    $functionalLocation = Equipment::where('code', 'EMO123456')->first();
    expect($functionalLocation)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('equipments.store'), [
            'code' => 'EM0123456',
            'sort_field' => 'SUPER LONG SORT FIELD SHOULD BE FAILED VALIDATION IN EQUIPMENT STORE REQUEST BECAUSE MORE THAN 50 CHARACTER',
            'description' => '',
            'functional_location_id' => 'FP-01-PM3-OCC-PULP-P001',
            'equipment_class_id' => '100',
            'equipment_status_id' => '100',
        ]);

    $response->assertSessionHasErrors([
        'code',
        'sort_field',
        'description',
        'functional_location_id',
        'equipment_class_id',
        'equipment_status_id'
    ]);
});

test('edit page accessible', function () {
    $equipment = Equipment::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('equipments.edit', $equipment->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('equipment/edit')
                ->has('equipment.data')
                ->has('equipmentClasses')
                ->has('equipmentStatuses')
        );
});

test('update equipment successfully', function () {
    $equipment = Equipment::factory()->create();
    $functionalLocation = FunctionalLocation::factory()->create();
    $equipmentClass = EquipmentClass::factory()->create();
    $equipmentStatus = EquipmentStatus::factory()->create();

    expect($equipment)->not()->toBe(null);

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipments.edit', $equipment->id))
        ->patch(route('equipments.update', $equipment->id), [
            'code' => 'ELP123456',
            'sort_field' => 'PM3.VACUUM.M-CLEAN',
            'description' => 'AC MOTOR;380V;4P;1500RPM;40A',
            'functional_location_id' => $functionalLocation->id,
            'equipment_class_id' => $equipmentClass->id,
            'equipment_status_id' => $equipmentStatus->id
        ])
        ->assertRedirect(route('equipments.edit', $equipment->id));

    assertDatabaseHas('equipments', ['code' => 'ELP123456']);
});

test('update equipment fails validation', function () {
    $equipment = Equipment::factory()->create();
    $functionalLocation = FunctionalLocation::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipments.edit', $equipment->id))
        ->patch(route('equipments.update', $equipment->id), [
            'code' => 'EM0123456',
            'sort_field' => 'SUPER LONG SORT FIELD SHOULD BE FAILED VALIDATION IN EQUIPMENT STORE REQUEST BECAUSE MORE THAN 50 CHARACTER',
            'description' => '',
            'functional_location_id' => 'FP-01-PM3-OCC-PULP-P001',
            'equipment_class_id' => '2',
            'equipment_status_id' => '100',
        ])
        ->assertSessionHasErrors([
            'code',
            'sort_field',
            'description',
            'functional_location_id',
            'equipment_class_id',
            'equipment_status_id'
        ]);
});

test('can delete equipment', function () {
    $equipment = Equipment::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipments.index'))
        ->delete(route('equipments.destroy', $equipment->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Equipment deleted successfully',
        ]);

    expect(Equipment::find($equipment->id))->toBeNull();
});
