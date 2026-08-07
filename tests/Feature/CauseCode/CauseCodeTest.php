<?php

use App\Models\CauseCode;
use Database\Seeders\CauseCodeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['CauseCode']);

    $this->seed(CauseCodeSeeder::class);
});

test('cause code index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('cause-codes.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('cause-code/index')
                ->has('causeCodes.data', 10)
        );
});

test('create cause code page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('cause-codes.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('cause-code/create')
        );
});

test('store cause code successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('cause-codes.create'))
        ->post(route('cause-codes.store'), [
            'code' => 'A300',
            'description' => 'INCIDENT MINOR',
        ]);

    $response
        ->assertRedirect(route('cause-codes.create'));

    $causeCode = CauseCode::where('code', 'A300')->first();
    expect($causeCode)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('cause-codes.store'), [
            'code' => null,
            'description' => null,
        ]);

    $response->assertSessionHasErrors(['code', 'description']);
});

test('edit page accessible', function () {
    $causeCode = CauseCode::first();

    $this
        ->actingAs(createAdminUser())
        ->get(route('cause-codes.edit', $causeCode->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('cause-code/edit')
                ->has('causeCode.data')
                ->has('causeCode.data.id')
                ->has('causeCode.data.code')
                ->has('causeCode.data.description')
        );
});

test('update cause code successfully', function () {
    $causeCode = CauseCode::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('cause-codes.edit', $causeCode->id))
        ->put(route('cause-codes.update', $causeCode->id), [
            'code' => 'A400',
            'description' => 'MINOR INCIDENT',
        ])
        ->assertRedirect(route('cause-codes.edit', $causeCode->id));

    $causeCode->refresh();
    expect($causeCode->code)->toBe('A400');
    expect($causeCode->description)->toBe('MINOR INCIDENT');
});

test('update cause code fails validation', function () {
    $causeCode = CauseCode::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('cause-codes.edit', $causeCode->id))
        ->patch(route('cause-codes.update', $causeCode->id), [
            'code' => '',
            'description' => '',
        ])
        ->assertSessionHasErrors(['code', 'description']);
});

test('can delete cause code', function () {
    $causeCode = CauseCode::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('cause-codes.index'))
        ->delete(route('cause-codes.destroy', $causeCode->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Cause code deleted successfully',
        ]);

    expect(CauseCode::find($causeCode->id))->toBeNull();
});
