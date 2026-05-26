<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DeploymentSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            EquipmentClassSeeder::class,
            EquipmentStatusSeeder::class,
            FindingClauseSeeder::class,
            FindingPrioritySeeder::class,
            FindingStatusSeeder::class,
            FindingTypeSeeder::class,
            CauseCodeSeeder::class,
            MaterialTypeSeeder::class,
            MaterialUnitSeeder::class,
            QualityRatingSeeder::class,
        ]);
    }
}
