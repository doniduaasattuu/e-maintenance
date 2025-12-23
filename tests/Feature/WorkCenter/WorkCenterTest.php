<?php

use App\Models\WorkCenter;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $models = ['User', 'WorkCenter'];

    foreach ($models as $model) {
        foreach (config('permission.actions') as $action) {
            Permission::firstOrCreate([
                'name' => "{$action}_" . strtolower($model)
            ]);
        }
    }
});

test('admin can create work center with valid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('work-centers.create'))
        ->post(route('work-centers.store'), [
            'name' => 'Maintenance Enchancement',
            'code' => 'PMN21001',
        ])
        ->assertRedirect(route('work-centers.create'));
});

test('admin cannot create work center with invalid data', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->from(route('work-centers.create'))
        ->post(route('work-centers.store'), [
            'name' => '',
            'code' => 'PMN',
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin cannot create duplicate work center', function () {
    $admin = createAdminUser();
    $workcenter = WorkCenter::factory()->create();

    $this->actingAs($admin)
        ->from(route('work-centers.create'))
        ->post(route('work-centers.store'), [
            'name' => $workcenter->name,
            'code' => $workcenter->code,
        ])
        ->assertSessionHasErrors(['name', 'code']);
});

test('admin can update work center', function () {
    $admin = createAdminUser();
    $workcenter = WorkCenter::factory()->create();

    $editPage = route('work-centers.edit', $workcenter->id);
    $updatePage = route('work-centers.update', $workcenter->id);

    $this->actingAs($admin)
        ->from($editPage)
        ->patch($updatePage, [
            'name' => 'Electrical Non Shift PM37',
            'code' => $workcenter->code,
        ])
        ->assertRedirect($editPage)
    ;

    $this->assertDatabaseHas('work_centers', ['name' => 'Electrical Non Shift PM37']);
});

test('admin can delete work center', function () {
    $admin = createAdminUser();
    $workcenter = WorkCenter::create(['code' => 'PME21001', 'name' => 'Electric Non Shift PM37']);

    $indexPage = route('work-centers.index');
    $deletePage = route('work-centers.destroy', $workcenter->id);

    $this->actingAs($admin)
        ->from($indexPage)
        ->delete($deletePage)
        ->assertRedirect($indexPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Work center deleted successfully',
            ]
        );
});

test('deleting a work center nullifies work_center_id of its users', function () {
    $admin = createAdminUser();
    $workcenter = WorkCenter::create(['code' => 'EI2', 'name' => 'Electric PM37']);
    $user = createNormalUser([
        'work_center_id' => $workcenter->id,
    ]);
    expect($user->refresh()->work_center_id)->not()->toBeNull();

    $indexPage = route('work-centers.index');
    $deletePage = route('work-centers.destroy', $workcenter->id);

    $this->actingAs($admin)
        ->from($indexPage)
        ->delete($deletePage)
        ->assertRedirect($indexPage)
        ->assertSessionHas(
            'message',
            [
                'type' => 'success',
                'description' => 'Work center deleted successfully',
            ]
        );

    expect($user->refresh()->work_center_id)->toBeNull();
});
