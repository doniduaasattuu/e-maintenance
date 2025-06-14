<?php

use App\Models\Department;
use App\Models\Division;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
});

test('admin can create department with valid data', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();

    $this->actingAs($admin)
        ->from(route('departments.create'))
        ->post(route('departments.store'), [
            'name' => 'Electric PM37',
            'code' => 'EI2',
            'division_id' => $division->id,
        ])
        ->assertRedirect(route('departments.index'));
});

test('admin cannot create department with invalid data', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();

    $this->actingAs($admin)
        ->from(route('departments.create'))
        ->post(route('departments.store'), [
            'name' => '',
            'code' => '',
            'division_id' => $division->id + 1,
        ])
        ->assertSessionHasErrors(['name', 'code', 'division_id']);
});

test('admin cannot create duplicate department', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();
    $department = Department::factory()->create();

    $this->actingAs($admin)
        ->from(route('departments.create'))
        ->post(route('departments.store'), [
            'name' => $department->name,
            'code' => $department->code,
            'division_id' => $division->id,
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin can update department', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();
    $department = Department::create(['code' => 'EI2', 'name' => 'Electric PM37']);
    $editPage = route('departments.edit', $department->id);
    $updatePage = route('departments.update', $department->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->patch($updatePage, [
            'name' => 'Electric Instrument PM37',
            'code' => $department->code,
            'division_id' => $division->id,
        ])
        ->assertRedirect($editPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Department updated successfully',
            ]
        );

    $this->assertDatabaseHas('departments', ['name' => 'Electric Instrument PM37']);
});

test('admin can delete department', function () {
    $admin = createAdminUser();
    $department = Department::create(['code' => 'EI2', 'name' => 'Electric PM37']);

    $indexPage = route('departments.index');
    $deletePage = route('departments.destroy', $department->id);

    $this->actingAs($admin)
        ->from($indexPage)
        ->delete($deletePage)
        ->assertRedirect($indexPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Department deleted successfully',
            ]
        );
});

test('deleting a department nullifies department_id of its users', function () {
    $admin = createAdminUser();
    $department = Department::create(['code' => 'EI2', 'name' => 'Electric PM37']);
    $user = createNormalUser([
        'department_id' => $department->id,
    ]);
    expect($user->refresh()->department_id)->not()->toBeNull();

    $indexPage = route('departments.index');
    $deletePage = route('departments.destroy', $department->id);

    $this->actingAs($admin)
        ->from($indexPage)
        ->delete($deletePage)
        ->assertRedirect($indexPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Department deleted successfully',
            ]
        );

    expect($user->refresh()->department_id)->toBeNull();
});

test('deleting a division nullifies division_id of its department', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();
    $department = Department::create(['code' => 'EI2', 'name' => 'Electric PM37', 'division_id' => $division->id]);

    expect($department->division_id)->not()->toBeNull();

    $indexPage = route('divisions.index');
    $deletePage = route('divisions.destroy', $division->id);

    $this->actingAs($admin)
        ->from($indexPage)
        ->delete($deletePage)
        ->assertRedirect($indexPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Division deleted successfully',
            ]
        );

    expect($department->refresh()->division_id)->toBeNull();
});
