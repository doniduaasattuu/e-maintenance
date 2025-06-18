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
        ]);
    }
}
