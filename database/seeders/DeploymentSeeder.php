<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DeploymentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            // ElectricianSeeder::class,
            PermissionSeeder::class,
            // RoleSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            QualityRatingSeeder::class,
            MaterialUnitSeeder::class,
            MaterialTypeSeeder::class,
        ]);
    }
}
