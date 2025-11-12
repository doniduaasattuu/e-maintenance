<?php

use App\Models\Material;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\UnitSeeder;
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
