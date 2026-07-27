<?php

use App\Models\Finding;
use App\Models\FindingType;
use Database\Seeders\CauseCodeSeeder;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingPrioritySeeder;
use Database\Seeders\FindingSeeder;
use Database\Seeders\FindingStatusSeeder;
use Database\Seeders\FindingTypeSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->generatePermissions(['Finding']);

    $this->seed([
        FindingStatusSeeder::class,
        FindingTypeSeeder::class,
        FindingClauseSeeder::class,
        FindingPrioritySeeder::class,
        CauseCodeSeeder::class,
        UserSeeder::class,
        FindingSeeder::class
    ]);
});

test('normal user cannot access abnormality index page', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('abnormalities.index'))
        ->assertStatus(403);
});

test('normal user cannot access abnormality create form', function () {
    $user = createNormalUser();

    $this->actingAs($user)
        ->get(route('abnormalities.create'))
        ->assertStatus(403);
});

test('normal user cannot access abnormality edit form', function () {
    $user = createNormalUser();
    $finding = Finding::factory()->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->first(),
    ]);

    $this->actingAs($user)
        ->get(route('abnormalities.edit', $finding))
        ->assertStatus(403);
});

test('guest cannot access abnormality index page', function () {
    $this
        ->get(route('abnormalities.index'))
        ->assertRedirect(route('login'));
});

test('guest cannot access abnormality create form', function () {
    $this
        ->get(route('abnormalities.create'))
        ->assertRedirect(route('login'));
});

test('guest cannot access abnormality edit form', function () {
    $finding = Finding::factory()->create();

    $this
        ->get(route('abnormalities.edit', $finding->id))
        ->assertRedirect(route('login'));
});
