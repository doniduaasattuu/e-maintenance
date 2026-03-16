<?php

namespace Database\Seeders;

use App\Models\MaterialUnit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaterialUnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            "M",
            "Pcs",
            "Batang",
            "Liter",
            "Kg",
            "Unit",
            "Pasang",
            "Roll",
            "Lembar",
            "Dus",
            "Box",
            "Bungkus",
            "Meter Kubik",
            "Rim",
            "Lusin",
            "Kodi",
            "Ons",
            "Gram",
            "Mililiter",
            "Centimeter",
            "Set",
            "Kit",
            "Lot",
            "Each",
            "Pack",
            "AU",
            "Sack",
            "Bag",
            "Meter persegi",
            "Tube",
            "Kaleng",
            "Galon",
            "Ton",
            "Drigen",
            "Tank",
            "Feet",
        ];

        collect($units)->each(function ($u) {
            MaterialUnit::firstOrCreate(['name' => $u]);
        });
    }
}
