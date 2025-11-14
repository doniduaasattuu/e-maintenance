<?php

namespace Database\Seeders;

use App\Models\MaterialType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MaterialTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mrp_types = [
            ["code" => "V1", "description" => "Automatic reorder point planning including external requirements"],
            ["code" => "VB", "description" => "Manual reorder point planning"],
            ["code" => "ND", "description" => "No planning"],
            ["code" => "PD", "description" => "MRP"],
            ["code" => "P1", "description" => "MRP with fixed order date"],
            ["code" => "P2", "description" => "MRP with fixed lot size"],
            ["code" => "P3", "description" => "MRP with fixed order date and lot size"],
            ["code" => "M0", "description" => "Master Production Scheduling (MPS)"],
            ["code" => "M1", "description" => "MPS with fixed lot size"],
            ["code" => "M2", "description" => "MPS with fixed order date"],
            ["code" => "M3", "description" => "MPS with fixed lot size and order date"],
            ["code" => "V2", "description" => "Automatic reorder point planning excluding external requirements"],
            ["code" => "VS", "description" => "Forecast-based planning"],
            ["code" => "VM", "description" => "Forecast-based planning with manual forecast entry"],
            ["code" => "W1", "description" => "Time-phased planning"],
            ["code" => "W2", "description" => "Time-phased planning with fixed lot size"],
            ["code" => "W3", "description" => "Time-phased planning with manual forecast entry"]
        ];

        collect($mrp_types)->each(function ($mrp) {
            MaterialType::firstOrCreate([
                'code' => $mrp['code'],
                'description' => $mrp['description'],
            ]);
        });
    }
}
