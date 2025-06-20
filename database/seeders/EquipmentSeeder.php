<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Equipment::factory()
            ->count(20)
            ->for(FunctionalLocation::factory()->create())
            ->for(EquipmentClass::factory()->create())
            ->for(EquipmentStatus::factory()->create())
            ->create();
    }
}
