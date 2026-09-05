<?php

use App\Models\ImprovementCategory;
use Database\Seeders\ImprovementCategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementCategory']);

    $this->seed(ImprovementCategorySeeder::class);
});

test('improvement category index page accessible', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-categories.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-category/index')
                ->has('improvementCategories.data', 8)
        );
});

test('create improvement category page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-categories.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('improvement-category/create')
        );
});

test('store improvement category successfully', function () {
    ImprovementCategory::factory()->count(5)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-categories.create'))
        ->post(route('improvement-categories.store'), [
            'name' => 'Abnormality',
            'description' => 'Improvement intended to abnormality.'
        ]);

    $response
        ->assertRedirect(route('improvement-categories.create'));

    $improvementCategory = ImprovementCategory::where('name', 'Abnormality')->first();
    expect($improvementCategory)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('improvement-categories.store'), [
            'name' => '',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['name', 'description']);
});

test('edit page accessible', function () {
    $improvementCategory = ImprovementCategory::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-categories.edit', $improvementCategory->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-category/edit')
                ->has('improvementCategory.data')
                ->has('improvementCategory.data.id')
                ->has('improvementCategory.data.name')
                ->has('improvementCategory.data.description')
        );
});

test('update improvement category successfully', function () {
    $improvementCategory = ImprovementCategory::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-categories.edit', $improvementCategory->id))
        ->put(route('improvement-categories.update', $improvementCategory->id), [
            'name' => 'Abnormality',
            'description' => 'Improvement intended to abnormality.'
        ])
        ->assertRedirect(route('improvement-categories.edit', $improvementCategory->id));

    $improvementCategory->refresh();
    expect($improvementCategory->name)->toBe('Abnormality');
});

test('update improvement category fails validation', function () {
    $improvementCategory = ImprovementCategory::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-categories.edit', $improvementCategory->id))
        ->patch(route('improvement-categories.update', $improvementCategory->id), [
            'name' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['name', 'description']);
});

test('can delete improvement category', function () {
    $improvementCategory = ImprovementCategory::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-categories.index'))
        ->delete(route('improvement-categories.destroy', $improvementCategory->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Improvement category deleted successfully',
        ]);

    expect(ImprovementCategory::find($improvementCategory->id))->toBeNull();
});
