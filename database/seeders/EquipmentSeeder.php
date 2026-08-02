<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\EquipmentType;
use App\Models\FunctionalLocation;
use Illuminate\Database\Eloquent\Factories\Sequence;
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
            ->state(new Sequence(fn(Sequence $sequence) => [
                'functional_location_id' => FunctionalLocation::first()->id ?? FunctionalLocation::factory()->create()->id,
                'equipment_class_id' => EquipmentClass::first()->id ?? EquipmentClass::factory()->create()->id,
                'equipment_status_id' => EquipmentStatus::first()->id ?? EquipmentStatus::factory()->create()->id,
                'equipment_type_id' => EquipmentType::first()->id ?? EquipmentType::factory()->create([
                    'equipment_class_id' => EquipmentClass::first()->id ?? EquipmentClass::factory()->create()->id,
                ])->id,
            ]))
            ->create();
    }
}
