<?php

use App\Models\FindingClause;
use Database\Seeders\FindingClauseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingClause']);

    $this->seed(FindingClauseSeeder::class);
});

test('finding clause index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-clauses.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-clause/index')
                ->has('findingClauses.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('finding-clauses.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-clause/index')
                ->has('findingClauses.data', 10)
        );
});

test('finding clause create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('finding-clauses.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding-clause/create'),
        );
});

test('finding clause edit form should be rendered', function () {
    $admin = createAdminUser();
    $findingClause = FindingClause::first();

    $this->actingAs($admin)
        ->get(route('finding-clauses.edit', $findingClause->id))
        ->assertInertia(
            fn($page) => $page
                ->component('finding-clause/edit')
                ->has('findingClause.data')
                ->has('findingClause.data.id')
                ->has('findingClause.data.code')
                ->has('findingClause.data.title')
                ->has('findingClause.data.description')
        );
});
