<?php

use App\Models\ImprovementCategory;
use Database\Seeders\ImprovementCategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementCategory']);

    $this->seed([
        ImprovementCategorySeeder::class,
    ]);
});

test('improvement category index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('improvement-categories.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-category/index')
                ->has('improvementCategories.data', 8)
        );

    $this->actingAs($admin)
        ->get(route('improvement-categories.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-category/index')
                ->has('improvementCategories.data', 0)
        );
});

test('improvement category create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('improvement-categories.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('improvement-category/create'),
        );
});

test('improvement category edit form should be rendered', function () {
    $admin = createAdminUser();
    $improvementCategory = ImprovementCategory::first();

    $this->actingAs($admin)
        ->get(route('improvement-categories.edit', $improvementCategory->id))
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-category/edit')
                ->has('improvementCategory.data')
                ->has('improvementCategory.data.id')
                ->has('improvementCategory.data.name')
                ->has('improvementCategory.data.description')
        );
});
