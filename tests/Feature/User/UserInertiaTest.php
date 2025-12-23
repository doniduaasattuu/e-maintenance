<?php

use App\Models\User;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\DivisionSeeder;
use Database\Seeders\PositionSeeder;
use Database\Seeders\WorkCenterSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['User']);

    $this->seed(DivisionSeeder::class);
    $this->seed(DepartmentSeeder::class);
    $this->seed(PositionSeeder::class);
    $this->seed(WorkCenterSeeder::class);
    Role::create(['name' => 'Inspector']);
    Role::create(['name' => 'Supervisor']);
    Role::create(['name' => 'Management']);

    User::factory()->count(20)->create();
});

test('user index should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('users.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('user/index')
                ->has('users.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('users.index', ['page' => '2']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('user/index')
                ->has('users.data', 10)
        );

    $this->actingAs($admin)
        ->get(route('users.index', ['page' => '3']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('user/index')
                ->has('users.data', 1)
        );
});

test('user create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('users.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('user/create')
                ->has('departments.data')
                ->has('positions.data')
                ->has('workCenters.data')
                ->has('availableRoles')
        );
});

test('user edit form should be rendered', function () {
    $admin = createAdminUser();
    $user = User::orderBy('id', 'DESC')->first();

    $this->actingAs($admin)
        ->get(route('users.edit', $user->id))
        ->assertInertia(
            fn($page) => $page
                ->component('user/edit')
                ->has('user.data')
                ->has('user.data.id')
                ->has('user.data.name')
                ->has('departments.data')
                ->has('positions.data')
                ->has('workCenters.data')
                ->has('availableRoles')
                ->has('userRoles')
        );
});
