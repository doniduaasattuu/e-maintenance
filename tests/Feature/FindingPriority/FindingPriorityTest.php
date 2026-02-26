<?php

use App\Models\FindingPriority;
use Database\Seeders\FindingPrioritySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\assertDatabaseEmpty;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingPriority']);

    $this->seed(FindingPrioritySeeder::class);
});

test('finding priority index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-priorities.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-priority/index')
                ->has('findingPriorities.data', 5)
        );
});

test('create finding priority page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-priorities.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('finding-priority/create')
        );
});

test('store finding priority successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('finding-priorities.create'))
        ->post(route('finding-priorities.store'), [
            'label' => 'Ignored',
            'description' => 'Ignored due to schedulded next shutdown.'
        ]);

    $response
        ->assertRedirect(route('finding-priorities.create'));

    $findingPriority = FindingPriority::where('label', 'Ignored')->first();
    expect($findingPriority)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('finding-priorities.store'), [
            'label' => '',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['label', 'description']);
});

test('store fails duplicate validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('finding-priorities.store'), [
            'label' => 'Minor',
            'description' => '',
        ]);

    $response->assertSessionHasErrors(['label', 'description']);
});

test('edit page accessible', function () {
    $findingPriority = FindingPriority::first();

    $this
        ->actingAs(createAdminUser())
        ->get(route('finding-priorities.edit', $findingPriority->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-priority/edit')
                ->has('findingPriority.data')
                ->has('findingPriority.data.id')
                ->has('findingPriority.data.label')
                ->has('findingPriority.data.description')
        );
});

test('update finding priority successfully', function () {
    $findingPriority = FindingPriority::first();
    $label = $findingPriority->label;

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-priorities.edit', $findingPriority->id))
        ->put(route('finding-priorities.update', $findingPriority->id), [
            'label' => 'Deleted',
            'description' => 'Finding is deleted',
        ])
        ->assertRedirect(route('finding-priorities.edit', $findingPriority->id));

    $findingPriority->refresh();
    expect($findingPriority->label)->toBe('Deleted');
    expect($findingPriority->description)->toBe('Finding is deleted');
    expect(FindingPriority::where('label', $label)->first())->toBeNull();
});

test('update finding priority fails validation', function () {
    $findingPriority = FindingPriority::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-priorities.edit', $findingPriority->id))
        ->patch(route('finding-priorities.update', $findingPriority->id), [
            'label' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['label', 'description']);
});

test('can delete finding priority', function () {
    $findingPriority = FindingPriority::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-priorities.index'))
        ->delete(route('finding-priorities.destroy', $findingPriority->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Finding priority deleted successfully',
        ]);

    expect(FindingPriority::find($findingPriority->id))->toBeNull();
});
