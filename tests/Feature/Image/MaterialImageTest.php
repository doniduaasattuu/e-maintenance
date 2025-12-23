<?php

use App\Models\Image;
use App\Models\Material;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\UnitSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Material', 'Image']);

    $this->seed(UnitSeeder::class);
    $this->seed(MaterialTypeSeeder::class);
    $this->seed(MaterialSeeder::class);
});

test('authorized user can upload image material', function () {
    Storage::fake('public');

    $admin = createAdminUser();
    $material = Material::factory()->create();
    $this->assertCount(0, $material->images);

    $this->actingAs($admin)
        ->post(route('images.store', ['material', $material->id]), [
            'image' => UploadedFile::fake()->image('test.jpg'),
        ])
        ->assertStatus(200)
        ->assertSessionHasNoErrors();

    $material->refresh();
    $this->assertCount(1, $material->images);

    $image = $material->images()->first();
    $this->assertDatabaseHas('images', [
        'id' => $image->id,
        'path' => $image->path,
    ]);

    Storage::disk('public')->assertExists($image->path);
});

test('upload image material fails validation', function () {
    $admin = createAdminUser();
    $material = Material::first();

    $this->actingAs($admin)
        ->post(route('images.store', ['material', $material->id]), [
            'image' => null,
        ])
        ->assertStatus(302)
        ->assertSessionHasErrors(['image']);
});

test('delete image material fail not found', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->delete(route('images.destroy', 1))
        ->assertStatus(404);
});

test('test delete material and images are also automatically deleted', function () {
    $material = Material::factory()->create();

    $this->assertNotNull($material);
    $this->assertEquals(0, count($material->images));

    $material->images()->createMany([
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
        ['path' => 'assets/images/material/' . Str::uuid() . '.jpg'],
    ]);

    $this->assertCount(3, Image::get());

    $this
        ->actingAs(createAdminUser())
        ->from(route('materials.index'))
        ->delete(route('materials.destroy', $material->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Material deleted successfully',
        ]);

    $this->assertCount(0, Image::get());
});
