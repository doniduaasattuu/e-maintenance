<?php

use App\Models\FunctionalLocation;
use App\Models\User;
use Database\Seeders\FunctionalLocationSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'create_functionallocation']);
    Permission::create(['name' => 'read_functionallocation']);
    Permission::create(['name' => 'update_functionallocation']);
    Permission::create(['name' => 'delete_functionallocation']);

    $this->seed(FunctionalLocationSeeder::class);
});

test('functional location index page accessible', function () {
    User::factory()->count(3)->create();

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('functional-locations.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('functional-location/index')
                ->has('functionalLocations.data', 15)
        );
});

test('create functional location page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('functional-locations.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('functional-location/create')
        );
});

test('store functional location successfully', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('functional-locations.create'))
        ->post(route('functional-locations.store'), [
            'code' => 'FP-01-PM3-CUT-RWD1',
            'description' => 'REWINDER #1 PM3',
        ]);

    $response
        ->assertRedirect(route('functional-locations.create'));

    $functionalLocation = FunctionalLocation::where('code', 'FP-01-PM3-CUT-RWD1')->first();
    expect($functionalLocation)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('functional-locations.store'), [
            'code' => 'fp-01--PM3',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['code', 'description']);
});

test('edit page accessible', function () {
    $functionalLocation = FunctionalLocation::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('functional-locations.edit', $functionalLocation->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('functional-location/edit')
                ->has('functionalLocation.data')
                ->has('functionalLocation.data.id')
                ->has('functionalLocation.data.code')
                ->has('functionalLocation.data.description')
        );
});

test('update functional location successfully', function () {
    $functionalLocation = FunctionalLocation::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('functional-locations.edit', $functionalLocation->id))
        ->put(route('functional-locations.update', $functionalLocation->id), [
            'code' => 'FP-01-PM3-P001',
            'description' => 'POMPA #1 PULPER SP-03',
        ])
        ->assertRedirect(route('functional-locations.edit', $functionalLocation->id));

    $functionalLocation->refresh();
    expect($functionalLocation->code)->toBe('FP-01-PM3-P001');
    expect($functionalLocation->description)->toBe('POMPA #1 PULPER SP-03');
});

test('update functional location fails validation', function () {
    $functionalLocation = FunctionalLocation::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('functional-locations.edit', $functionalLocation->id))
        ->patch(route('functional-locations.update', $functionalLocation->id), [
            'code' => 'FP--01-PM3-P001',
            'description' => 'lowercase description',
        ])
        ->assertSessionHasErrors(['code', 'description']);
});

test('can delete functional location', function () {
    $functionalLocation = FunctionalLocation::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('functional-locations.index'))
        ->delete(route('functional-locations.destroy', $functionalLocation->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Functional location deleted successfully',
        ]);

    expect(FunctionalLocation::find($functionalLocation->id))->toBeNull();
});
