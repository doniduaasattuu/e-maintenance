<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_image']);
    Permission::create(['name' => 'read_image']);
    Permission::create(['name' => 'update_image']);
    Permission::create(['name' => 'delete_image']);

    $this->seed(FunctionalLocationSeeder::class);
    $this->seed(EquipmentClassSeeder::class);
    $this->seed(EquipmentStatusSeeder::class);
    $this->seed(EquipmentSeeder::class);
});

test('authorized user can upload image equipment', function () {
    Storage::fake('public');

    $admin = createAdminUser();
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => EquipmentClass::all()->random()->id,
        'equipment_status_id' => EquipmentStatus::all()->random()->id
    ]);
    $this->assertCount(0, $equipment->images);

    $this->actingAs($admin)
        ->post(route('images.store', ['equipment', $equipment->id]), [
            'image' => UploadedFile::fake()->image('test.jpg'),
        ])
        ->assertStatus(200)
        ->assertSessionHasNoErrors();

    $equipment->refresh();
    $this->assertCount(1, $equipment->images);

    $image = $equipment->images()->first();
    $this->assertDatabaseHas('images', [
        'id' => $image->id,
        'path' => $image->path,
    ]);

    Storage::disk('public')->assertExists($image->path);
});

test('upload image equipment fails validation', function () {
    $admin = createAdminUser();
    $equipment = Equipment::first();

    $this->actingAs($admin)
        ->post(route('images.store', ['equipment', $equipment->id]), [
            'image' => null,
        ])
        ->assertStatus(302)
        ->assertSessionHasErrors(['image']);
});
