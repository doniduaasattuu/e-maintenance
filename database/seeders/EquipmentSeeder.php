<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\FunctionalLocation;
use App\Models\Image;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = Image::all();

        Equipment::factory()
            ->count(20)
            ->state(new Sequence(fn(Sequence $sequence) => [
                'functional_location_id' => FunctionalLocation::all()->random()->id,
                'equipment_class_id' => EquipmentClass::all()->random()->id,
                'equipment_status_id' => EquipmentStatus::all()->random()->id,
            ]))
            ->create()
            ->each(function ($equipment) use ($images) {
                $equipment->images()->attach(
                    $images->random(rand(3, 5))->pluck('id')->toArray()
                );
            });
    }
}
