<?php

use App\Models\Equipment;
use App\Models\Material;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentMaterialSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function PHPUnit\Framework\assertNotNull;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Equipment', 'Material', 'EquipmentMaterial']);
    $this->seed([
        EquipmentClassSeeder::class,
        EquipmentStatusSeeder::class,
        EquipmentTypeSeeder::class,
        EquipmentSeeder::class,
        MaterialTypeSeeder::class,
        MaterialUnitSeeder::class,
        MaterialSeeder::class,
    ]);
});

test('admin user can access equipment material page', function () {
    $admin = createAdminUser();
    $equipment = Equipment::first();
    $materials = Material::get();
    assertNotNull($equipment);
    $equipment->materials()->attach($materials);

    $this->actingAs($admin)
        ->get(route('equipments.materials', $equipment->id))
        ->assertStatus(200);
});

test('admin user can attach material to equipment', function () {
    $admin = createAdminUser();
    $equipment = Equipment::first();
    assertNotNull($equipment);

    $response = $this->actingAs($admin)
        ->post(route('equipments.materials.store', $equipment->id), [
            'material_id' => Material::first()->id,
            'quantity' => 2,
            'note' => 'Note test',
        ])
        ->assertStatus(302);

    $response->assertSessionHas('message', [
        'type' => 'success',
        'description' => 'Material added to equipment successfully.',
    ]);
});

// test('admin user can update material quantity to equipment', function () {
//     $admin = createAdminUser();
//     $equipment = Equipment::first();
//     $material = Material::first();
//     assertNotNull($equipment);

//     $response = $this->actingAs($admin)
//         ->post(route('equipments.materials.store', $equipment->id), [
//             'material_id' => $material->id,
//             'quantity' => 1,
//             'note' => 'Note test',
//         ])
//         ->assertStatus(302);

//     $response->assertSessionHas('message', [
//         'type' => 'success',
//         'description' => 'Material added to equipment successfully.',
//     ]);

//     $response = $this->actingAs($admin)
//         ->from(route('equipments.materials', $equipment->id))
//         ->put(route('equipments.materials.update', [
//             'equipment' => $equipment->id,
//             'material' => $material->id,
//         ]));

//     $response
//         ->assertStatus(302);
// });

// test('normal user cannot access equipment edit form', function () {
//     $user = createNormalUser();
//     $equipment = Equipment::first();

//     $this->actingAs($user)
//         ->get(route('equipments.edit', $equipment->id))
//         ->assertStatus(403);
// });

// test('guest cannot access equipment material page', function () {
//     $this
//         ->get(route('equipments.materials'))
//         ->assertRedirect(route('login'));
// });

// test('guest cannot access equipment create form', function () {
//     $this
//         ->get(route('equipments.create'))
//         ->assertRedirect(route('login'));
// });

// test('guest cannot access equipment edit form', function () {
//     $equipment = Equipment::factory()->create();

//     $this
//         ->get(route('equipments.edit', $equipment->id))
//         ->assertRedirect(route('login'));
// });
