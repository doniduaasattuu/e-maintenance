<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
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
            "Centimeter"
        ];

        collect($units)->each(function ($u) {
            Unit::firstOrCreate(['name' => $u]);
        });
    }
}
