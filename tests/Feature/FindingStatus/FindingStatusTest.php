<?php

use App\Models\FindingStatus;
use Database\Seeders\FindingStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingStatus']);

    $this->seed(FindingStatusSeeder::class);
});

test('finding status index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-statuses.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-status/index')
                ->has('findingStatuses.data', 5)
        );
});

test('create finding status page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-statuses.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('finding-status/create')
        );
});

test('store finding status successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('finding-statuses.create'))
        ->post(route('finding-statuses.store'), [
            'name' => 'Pending',
            'description' => 'Pending due to schedulded next shutdown.'
        ]);

    $response
        ->assertRedirect(route('finding-statuses.create'));

    $findingStatus = FindingStatus::where('name', 'Pending')->first();
    expect($findingStatus)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('finding-statuses.store'), [
            'name' => '',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['name', 'description']);
});

test('edit page accessible', function () {
    $findingStatus = FindingStatus::first();

    $this
        ->actingAs(createAdminUser())
        ->get(route('finding-statuses.edit', $findingStatus->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-status/edit')
                ->has('findingStatus.data')
                ->has('findingStatus.data.id')
                ->has('findingStatus.data.name')
                ->has('findingStatus.data.description')
        );
});

test('update finding status successfully', function () {
    $findingStatus = FindingStatus::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-statuses.edit', $findingStatus->id))
        ->put(route('finding-statuses.update', $findingStatus->id), [
            'name' => 'Deleted',
            'description' => 'Finding is deleted',
        ])
        ->assertRedirect(route('finding-statuses.edit', $findingStatus->id));

    $findingStatus->refresh();
    expect($findingStatus->name)->toBe('Deleted');
    expect($findingStatus->description)->toBe('Finding is deleted');
});

test('update finding status fails validation', function () {
    $findingStatus = FindingStatus::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-statuses.edit', $findingStatus->id))
        ->patch(route('finding-statuses.update', $findingStatus->id), [
            'name' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['name', 'description']);
});

test('can delete finding status', function () {
    $findingStatus = FindingStatus::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-statuses.index'))
        ->delete(route('finding-statuses.destroy', $findingStatus->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Finding status deleted successfully',
        ]);

    expect(FindingStatus::find($findingStatus->id))->toBeNull();
});
