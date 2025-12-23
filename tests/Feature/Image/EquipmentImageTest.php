<?php

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\Image;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Equipment', 'Image']);

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

test('delete image equipment fail not found', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->delete(route('images.destroy', 1))
        ->assertStatus(404);
});

test('test delete equipment and images are also automatically deleted', function () {
    $equipment = Equipment::factory()->create([
        'equipment_class_id' => EquipmentClass::first()->id,
        'equipment_status_id' => EquipmentStatus::first()->id,
    ]);

    $this->assertNotNull($equipment);
    $this->assertEquals(0, count($equipment->images));

    $equipment->images()->createMany([
        ['path' => 'assets/images/equipment/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/equipment/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/equipment/' . Str::uuid() . '.jpg'],
    ]);

    $this->assertCount(3, Image::get());

    $this
        ->actingAs(createAdminUser())
        ->from(route('equipments.index'))
        ->delete(route('equipments.destroy', $equipment->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Equipment deleted successfully',
        ]);

    $this->assertCount(0, Image::get());
});
