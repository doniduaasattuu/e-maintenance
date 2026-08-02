<?php

use App\Models\Finding;
use App\Models\FindingType;
use Database\Seeders\CauseCodeSeeder;
use Database\Seeders\EquipmentClassSeeder;
use Database\Seeders\EquipmentSeeder;
use Database\Seeders\EquipmentStatusSeeder;
use Database\Seeders\EquipmentTypeSeeder;
use Database\Seeders\FindingClauseSeeder;
use Database\Seeders\FindingPrioritySeeder;
use Database\Seeders\FindingStatusSeeder;
use Database\Seeders\FindingTypeSeeder;
use Database\Seeders\FunctionalLocationSeeder;
use Database\Seeders\MaterialSeeder;
use Database\Seeders\MaterialTypeSeeder;
use Database\Seeders\MaterialUnitSeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    $this->generatePermissions(['Finding', 'Audit', 'Abnormality']);
    Permission::findOrCreate('view_all_finding');

    $this->seed([
        FindingStatusSeeder::class,
        FindingTypeSeeder::class,
        FindingClauseSeeder::class,
        FindingPrioritySeeder::class,
        CauseCodeSeeder::class,
        UserSeeder::class,
        FunctionalLocationSeeder::class,
        EquipmentClassSeeder::class,
        EquipmentStatusSeeder::class,
        EquipmentTypeSeeder::class,
        EquipmentSeeder::class,
        MaterialUnitSeeder::class,
        MaterialTypeSeeder::class,
        MaterialSeeder::class,
    ]);
});

test('abnormality index should be rendered', function () {
    $admin = createAdminUser();
    $admin->givePermissionTo('view_all_finding');
    $abnormalities = Finding::factory()->count(15)->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
    ]);

    $this->assertNotNull($abnormalities);
    $this->assertCount(15, $abnormalities);

    $this->actingAs($admin)
        ->get(route('abnormalities.index', ['page' => '1']))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding/abnormality/index')
                ->has('findings.data'),
        );
});

test('abnormality create form should be rendered', function () {
    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('abnormalities.create'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('finding/abnormality/create'),
        );
});

test('abnormality edit form should be rendered', function () {
    $admin = createAdminUser();
    $admin->givePermissionTo('view_all_finding');

    $finding = Finding::factory()->create([
        'finding_type_id' => FindingType::where('code', 'ABN')->value('id'),
    ]);

    $this->assertNotNull($finding);
    $this->actingAs($admin)
        ->get(route('abnormalities.edit', $finding->id))
        ->assertInertia(
            fn($page) => $page
                ->component('finding/abnormality/edit')
                ->has('finding.data')
        );
});
