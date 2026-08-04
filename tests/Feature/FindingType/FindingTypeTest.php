<?php

use App\Models\FindingType;
use Database\Seeders\FindingTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingType']);

    $this->seed(FindingTypeSeeder::class);
});

test('finding type index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-types.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-type/index')
                ->has('findingTypes.data', 2)
        );
});

test('create finding type page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-types.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('finding-type/create')
        );
});

test('store finding type successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('finding-types.create'))
        ->post(route('finding-types.store'), [
            'code' => 'PD001',
            'name' => 'Pending',
            'description' => 'Pending due to schedulded next shutdown.'
        ]);

    $response
        ->assertRedirect(route('finding-types.create'));

    $findingType = FindingType::where('name', 'Pending')->first();
    expect($findingType)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('finding-types.store'), [
            'code' => null,
            'name' => null,
            'description' => null,
        ]);

    $response->assertSessionHasErrors(['code', 'name', 'description']);
});

test('edit page accessible', function () {
    $findingType = FindingType::first();

    $this
        ->actingAs(createAdminUser())
        ->get(route('finding-types.edit', $findingType->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-type/edit')
                ->has('findingType.data')
                ->has('findingType.data.id')
                ->has('findingType.data.name')
                ->has('findingType.data.description')
        );
});

test('update finding type successfully', function () {
    $findingType = FindingType::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-types.edit', $findingType->id))
        ->put(route('finding-types.update', $findingType->id), [
            'name' => 'Deleted',
            'description' => 'Finding is deleted',
        ])
        ->assertRedirect(route('finding-types.edit', $findingType->id));

    $findingType->refresh();
    expect($findingType->name)->toBe('Deleted');
    expect($findingType->description)->toBe('Finding is deleted');
});

test('update finding type fails validation', function () {
    $findingType = FindingType::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-types.edit', $findingType->id))
        ->patch(route('finding-types.update', $findingType->id), [
            'name' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['name', 'description']);
});

test('can delete finding type', function () {
    $findingType = FindingType::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-types.index'))
        ->delete(route('finding-types.destroy', $findingType->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Finding type deleted successfully',
        ]);

    expect(FindingType::find($findingType->id))->toBeNull();
});
