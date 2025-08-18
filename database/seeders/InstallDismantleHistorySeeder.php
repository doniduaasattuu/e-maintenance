<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use App\Models\InstallDismantleHistory;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class InstallDismantleHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InstallDismantleHistory::factory()
            ->count(20)
            ->state(new Sequence(fn(Sequence $sequence) => [
                'equipment_id' => Equipment::factory()->create()->id,
                'from_status_id' => EquipmentStatus::factory()->create()->id,
                'to_status_id' => EquipmentStatus::factory()->create()->id,
                'from_sort_field' => fake()->sentence(2),
                'to_sort_field' => fake()->sentence(2),
                'from_functional_location_id' => FunctionalLocation::factory()->create()->id,
                'to_functional_location_id' => FunctionalLocation::factory()->create()->id,
                'changed_by' => User::factory()->create()->id,
            ]))
            ->create();
    }
}
