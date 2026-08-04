<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Material;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EquipmentMaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment = Equipment::first() ?? Equipment::factory()->create();
        $materials = Material::factory()->count(10)->create();

        $equipment->materials()->attach($materials);
    }
}
