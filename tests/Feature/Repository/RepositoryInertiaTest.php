<?php

use App\Models\Repository;
use Database\Seeders\RepositorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Repository']);

    $this->seed(RepositorySeeder::class);
});

test('repository index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('repositories.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('repository/index')
                ->has('repositories.data', 10)

        );

    $this->actingAs($admin)
        ->get(route('repositories.index', [
            'page' => '2',
        ]))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('repository/index')
                ->has('repositories.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('repositories.index', [
            'page' => '3',
        ]))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('repository/index')
                ->has('repositories.data', 0)
        );
});

test('repository create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('repositories.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('repository/create')
                ->has('maximum_file_upload')
        );
});

test('repository edit form should be rendered', function () {
    $admin = createAdminUser();
    $repositories = Repository::factory()->create();

    $this->actingAs($admin)
        ->get(route('repositories.edit', $repositories->id))
        ->assertInertia(
            fn($page) => $page
                ->component('repository/edit')
                ->has('repository.data')
                ->has('repository.data.id')
                ->has('repository.data.title')
                ->has('repository.data.path')
                ->has('repository.data.extension')
                ->has('repository.data.mime_type')
                ->has('repository.data.url')
                ->has('repository.data.uploaded_by')
                ->has('repository.data.created_at')
                ->has('repository.data.updated_at')
        );
});
