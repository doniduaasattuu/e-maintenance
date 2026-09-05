<?php

use App\Models\ImprovementStatus;
use Database\Seeders\ImprovementStatusSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['ImprovementStatus']);

    $this->seed(ImprovementStatusSeeder::class);
});

test('improvement status index page accessible', function () {

    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-statuses.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-status/index')
                ->has('improvementStatuses.data', 5)
        );
});

test('create improvement status page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-statuses.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('improvement-status/create')
        );
});

test('store improvement status successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-statuses.create'))
        ->post(route('improvement-statuses.store'), [
            'name' => 'Processed',
            'color' => '#3B82F6',
            'sequence' => ImprovementStatus::last()->sequence + 10,
        ]);

    $response
        ->assertRedirect(route('improvement-statuses.create'));

    $improvementStatus = ImprovementStatus::where('name', 'Processed')->first();
    expect($improvementStatus)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('improvement-statuses.store'), [
            'name' => '',
            'color' => '',
            'sequence' => -1,
        ]);

    $response->assertSessionHasErrors(['name', 'color', 'sequence']);
});

test('edit page accessible', function () {
    $improvementStatus = ImprovementStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->get(route('improvement-statuses.edit', $improvementStatus->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('improvement-status/edit')
                ->has('improvementStatus.data')
                ->has('improvementStatus.data.id')
                ->has('improvementStatus.data.color')
                ->has('improvementStatus.data.sequence')
        );
});

test('update improvement status successfully', function () {
    $improvementStatus = ImprovementStatus::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-statuses.edit', $improvementStatus->id))
        ->put(route('improvement-statuses.update', $improvementStatus->id), [
            'name' => 'Processing',
            'color' => '#FE882A',
            'sequence' => ImprovementStatus::last()->sequence + 10,
        ])
        ->assertRedirect(route('improvement-statuses.edit', $improvementStatus->id));

    $improvementStatus->refresh();
    expect($improvementStatus->name)->toBe('Processing');
});

test('update improvement status fails validation', function () {
    $improvementStatus = ImprovementStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-statuses.edit', $improvementStatus->id))
        ->patch(route('improvement-statuses.update', $improvementStatus->id), [
            'name' => '',
            'color' => '',
            'sequence' => ImprovementStatus::first()->sequence,
        ])
        ->assertSessionHasErrors(['name', 'color', 'sequence']);
});

test('can delete improvement status', function () {
    $improvementStatus = ImprovementStatus::factory()->create();

    $this
        ->actingAs(createAdminUser())
        ->from(route('improvement-statuses.index'))
        ->delete(route('improvement-statuses.destroy', $improvementStatus->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Improvement status deleted successfully',
        ]);

    expect(ImprovementStatus::find($improvementStatus->id))->toBeNull();
});
