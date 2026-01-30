<?php

use App\Models\WorkCenter;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    foreach (config('permission.actions') as $action) {
        Permission::firstOrCreate([
            'name' => "{$action}_" . strtolower('workcenter')
        ]);
    }

    WorkCenter::factory()
        ->count(20)
        ->create();
});

test('work center index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('work-centers.index'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('work-center/index')
                ->has('workCenters.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('work-centers.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('work-center/index')
                ->has('workCenters.data', 10)
        );
});

test('work center create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('work-centers.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('work-center/create'),
        );
});

test('workcenter edit form should be rendered', function () {
    $admin = createAdminUser();
    $workCenter = WorkCenter::first();

    $this->actingAs($admin)
        ->get(route('work-centers.edit', $workCenter->id))
        ->assertInertia(
            fn($page) => $page
                ->component('work-center/edit')
                ->has('workCenter.data')
                ->has('workCenter.data.id')
                ->has('workCenter.data.name')
        );
});
