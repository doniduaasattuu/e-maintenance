<?php

use App\Exports\ArchivedFindingExport;
use Carbon\Carbon;
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
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Permission;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    $this->generatePermissions(['Finding', 'Audit', 'Abnormality']);
    Permission::findOrCreate('view_all_finding');

    Excel::fake();

    Carbon::setTestNow('2026-08-03 20:00:00');

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

test('exports archived findings', function () {

    $admin = createAdminUser();

    $this->actingAs($admin)
        ->get(route('findings.archived.export'));

    Excel::assertDownloaded(
        'Archived_Findings_20260803_200000.xlsx',
        fn(ArchivedFindingExport $export) => true
    );
});
