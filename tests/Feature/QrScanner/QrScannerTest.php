<?php

use App\Models\Equipment;
use App\Models\User;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    $models = ['Equipment'];

    foreach ($models as $model) {
        foreach (config('permission.actions') as $action) {
            Permission::firstOrCreate([
                'name' => "{$action}_" . strtolower($model)
            ]);
        }
    }
});

test('scan page is rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get('/qr-scanner')
        ->assertStatus(200);
});

test('scan page is not rendered', function () {

    $this
        ->get('/qr-scanner')
        ->assertRedirect(route('login'));
});

test('can scan equipment qr code', function () {
    $admin = createAdminUser();
    $equipment = Equipment::factory()->create();

    $this->actingAs($admin)
        ->get(route('equipments.scan', $equipment->code))
        ->assertRedirect(route('equipments.show', $equipment->id));
});

test('scan equipment not found will return message', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('equipments.scan', 'TDK000123'))
        ->assertSessionHas('message', [
            'type' => 'info',
            'description' => 'Equipment not found',
        ]);
});
