<?php

use App\Models\Finding;
use App\Models\FindingType;
use App\Models\User;
use Database\Seeders\CauseCodeSeeder;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingPrioritySeeder;
use Database\Seeders\FindingSeeder;
use Database\Seeders\FindingStatusSeeder;
use Database\Seeders\FindingTypeSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
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
        'inspected_by' => User::factory()->create()->id,
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
