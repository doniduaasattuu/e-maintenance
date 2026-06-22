<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            DatabaseCleaner::class,
            UserSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentSeeder::class,
            InspectionPanelSeeder::class,
            QualityRatingSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
            MaterialSeeder::class,
            ImageSeeder::class,
            RepositorySeeder::class,
            RepositoryEquipmentSeeder::class,
            FindingTypeSeeder::class,
            FindingClauseSeeder::class,
            FindingStatusSeeder::class,
            FindingPrioritySeeder::class,
            CauseCodeSeeder::class,
            FindingSeeder::class,
        ]);
    }
}
