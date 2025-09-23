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
            ImageSeeder::class,
            UserSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            FunctionalLocationSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            EquipmentSeeder::class,
            QualityRatingSeeder::class,
            UnitSeeder::class,
            MaterialTypeSeeder::class,
        ]);
    }
}
