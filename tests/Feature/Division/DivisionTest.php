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
});

test('admin can create division with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('divisions.create'))
        ->post(route('divisions.store'), [
            'name' => 'Engineering',
            'code' => 'ENG',
        ])
        ->assertRedirect(route('divisions.index'))->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Division created successfully',
            ],
        );
});

test('admin cannot create division with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('divisions.create'))
        ->post(route('divisions.store'), [
            'name' => '',
            'code' => '',
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin cannot create duplicate division', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();

    $this->actingAs($admin)
        ->from(route('divisions.create'))
        ->post(route('divisions.store'), [
            'name' => $division->name,
            'code' => $division->code,
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin can update division', function () {
    $admin = createAdminUser();
    $division = Division::factory()->create();

    $editPage = route('divisions.edit', $division->id);
    $updatePage = route('divisions.update', $division->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->patch($updatePage, [
            'name' => 'Engineering One',
            'code' => $division->code,
        ])
        ->assertRedirect($editPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Division updated successfully',
            ]
        );

    $this->assertDatabaseHas('divisions', ['name' => 'Engineering One']);
});

test('admin can delete division', function () {
    $admin = createAdminUser();
    $division = Division::create(['code' => 'EI2', 'name' => 'Electric PM37']);

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
});

test('deleting a division nullifies division_id of its departments', function () {
    $admin = createAdminUser();
    $division = Division::create(['code' => 'EI2', 'name' => 'Electric PM37']);
    $department = Department::factory()->create([
        'division_id' => $division->id,
    ]);

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
