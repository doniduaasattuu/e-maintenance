<?php

use App\Models\Department;
use App\Models\Division;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_division']);
    Permission::create(['name' => 'read_division']);
    Permission::create(['name' => 'update_division']);
    Permission::create(['name' => 'delete_division']);
    Permission::create(['name' => 'create_department']);
    Permission::create(['name' => 'read_department']);
    Permission::create(['name' => 'update_department']);
    Permission::create(['name' => 'delete_department']);

    Department::factory()
        ->count(20)
        ->has(Division::factory())
        ->create();

    Division::factory()->count(5)->create();
});

test('department index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('departments.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('department/index')
                ->has('departments.data', 15)
        );

    $this->actingAs($admin)
        ->get(route('departments.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('department/index')
                ->has('departments.data', 5)
        );
});

test('department create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('departments.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('department/create')
                ->has('divisions.data', 5)
        );
});

test('department edit form should be rendered', function () {
    $admin = createAdminUser();
    $department = Department::first();

    $this->actingAs($admin)
        ->get(route('departments.edit', $department->id))
        ->assertInertia(
            fn($page) => $page
                ->component('department/edit')
                ->has('department.data')
                ->has('department.data.id')
                ->has('department.data.name')
                ->has('department.data.code')
                ->has('department.data.division_id')
                ->has('divisions.data')
        );
});
