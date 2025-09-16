<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\Image;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Database\Seeders\ImageSeeder;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_image']);
    Permission::create(['name' => 'read_image']);
    Permission::create(['name' => 'update_image']);
    Permission::create(['name' => 'delete_image']);
    Permission::create(['name' => 'create_equipmentimage']);
    Permission::create(['name' => 'read_equipmentimage']);
    Permission::create(['name' => 'update_equipmentimage']);
    Permission::create(['name' => 'delete_equipmentimage']);

    $this->seed(ImageSeeder::class);
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
        ->post(route('equipment-image.store', $equipment->id), [
            'image' => UploadedFile::fake()->image('test.jpg'),
        ])
        ->assertStatus(302)
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
        ->post(route('equipment-image.store', $equipment->id), [
            'image' => null,
        ])
        ->assertStatus(302)
        ->assertSessionHasErrors(['image']);
});

test('authorized user can delete image that belongs only to one equipment', function () {
    Storage::fake('public');

    $admin = createAdminUser();
    $equipment = Equipment::factory()->create();

    // Create fake image in storage
    $file = UploadedFile::fake()->image('test.jpg');
    $filePath = $file->store('assets/images/equipment', 'public');

    $image = Image::create(['path' => $filePath]);
    $equipment->images()->attach($image);

    // Ensure the file exists
    Storage::disk('public')->assertExists($filePath);

    $this->actingAs($admin)
        ->delete(route('equipment-image.destroy', [$equipment->id, $image->id]))
        ->assertStatus(200); // or 302 depending on your response

    // It should be deleted from DB
    $this->assertDatabaseMissing('images', ['id' => $image->id]);

    // It should be deleted from storage
    Storage::disk('public')->assertMissing($filePath);

    // Relation should be detached
    $this->assertDatabaseMissing('equipment_image', [
        'equipment_id' => $equipment->id,
        'image_id' => $image->id,
    ]);
});

test('authorized user can detach image that belongs to multiple equipments but not delete it', function () {
    Storage::fake('public');

    $admin = createAdminUser();
    $equipment1 = Equipment::factory()->create();
    $equipment2 = Equipment::factory()->create();

    // Create fake image in storage
    $file = UploadedFile::fake()->image('test2.jpg');
    $filePath = $file->store('assets/images/equipment', 'public');

    $image = Image::create(['path' => $filePath]);
    $equipment1->images()->attach($image);
    $equipment2->images()->attach($image);

    // Ensure the file exists
    Storage::disk('public')->assertExists($filePath);

    $this->actingAs($admin)
        ->delete(route('equipment-image.destroy', [$equipment1->id, $image->id]))
        ->assertStatus(200);

    // It should still exist in DB because another equipment is using it
    $this->assertDatabaseHas('images', ['id' => $image->id]);

    // It should still exist in storage
    Storage::disk('public')->assertExists($filePath);

    // Relation to equipment1 should be detached
    $this->assertDatabaseMissing('equipment_image', [
        'equipment_id' => $equipment1->id,
        'image_id' => $image->id,
    ]);

    // Relation to equipment2 should still exist
    $this->assertDatabaseHas('equipment_image', [
        'equipment_id' => $equipment2->id,
        'image_id' => $image->id,
    ]);
});
