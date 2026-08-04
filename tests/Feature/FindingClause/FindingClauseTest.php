<?php

use App\Models\FindingClause;
use App\Models\FindingType;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['FindingClause']);

    $this->seed([
        FindingTypeSeeder::class,
        FindingClauseSeeder::class
    ]);
});

test('finding clause index page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-clauses.index'));

    $response->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-clause/index')
                ->has('findingClauses.data', 10)
        );
});

test('create finding clause page accessible', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->get(route('finding-clauses.create'));

    $response
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page->component('finding-clause/create')
        );
});

test('store finding clause successfully', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->from(route('finding-clauses.create'))
        ->post(route('finding-clauses.store'), [
            "code" => "O1.1",
            "type" => "AUD",
            "title" => "Audit 5R K3",
            "description" => "Adanya karat pada panel MCC akibat humidity yang tidak terkontrol.",
        ]);

    $response
        ->assertRedirect(route('finding-clauses.create'));

    $findingClause = FindingClause::where('code', 'O1.1')->first();
    expect($findingClause)->not()->toBeNull();
});

test('store fails validation', function () {
    $response = $this
        ->actingAs(createAdminUser())
        ->post(route('finding-clauses.store'), [
            'code' => null,
            'type' => null,
            'title' => null,
            'description' => null,
        ]);

    $response->assertSessionHasErrors(['code', 'type', 'title', 'description']);
});

test('edit page accessible', function () {
    $findingClause = FindingClause::first();

    $this
        ->actingAs(createAdminUser())
        ->get(route('finding-clauses.edit', $findingClause->id))
        ->assertStatus(200)
        ->assertInertia(
            fn($page) => $page
                ->component('finding-clause/edit')
                ->has('findingClause.data')
                ->has('findingClause.data.id')
                ->has('findingClause.data.code')
                ->has('findingClause.data.type')
                ->has('findingClause.data.title')
                ->has('findingClause.data.description')
        );
});

test('update finding clause successfully', function () {
    $findingType = FindingType::first();
    $findingClause = FindingClause::factory()->create([
        'code' => $findingType->code,
        'type' => 'Audit 5R K3'
    ]);

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-clauses.edit', $findingClause->id))
        ->put(route('finding-clauses.update', $findingClause->id), [
            "code" => $findingType->code,
            "type" => "AUD",
            "title" => "Audit 5R K3",
            "description" => "Adanya corona pada panel MDP 20kV akibat humidity yang tidak terkontrol.",
        ])
        ->assertRedirect(route('finding-clauses.edit', $findingClause->id));

    $findingClause->refresh();
    expect($findingClause->type)->toBe('AUD');
    expect($findingClause->title)->toBe('Audit 5R K3');
    expect($findingClause->description)->toBe('Adanya corona pada panel MDP 20kV akibat humidity yang tidak terkontrol.');
});

test('update finding clause fails validation', function () {
    $findingClause = FindingClause::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-clauses.edit', $findingClause->id))
        ->patch(route('finding-clauses.update', $findingClause->id), [
            'code' => null,
            'type' => null,
            'title' => null,
            'description' => null,
        ])
        ->assertSessionHasErrors(['code', 'type', 'title', 'description']);
});

test('can delete finding clause', function () {
    $findingClause = FindingClause::first();

    $this
        ->actingAs(createAdminUser())
        ->from(route('finding-clauses.index'))
        ->delete(route('finding-clauses.destroy', $findingClause->id))
        ->assertSessionHas('message', [
            'type' => 'success',
            'description' => 'Finding clause deleted successfully',
        ]);

    expect(FindingClause::find($findingClause->id))->toBeNull();
});
