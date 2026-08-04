<?php

namespace Database\Seeders;

use App\Models\Plant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plants = [
            [
                'code' => 'MC01',
                'name' => 'Machine 1',
            ],
            [
                'code' => 'MC02',
                'name' => 'Machine 2'
            ],
        ];

        collect($plants)->each(fn($p) => Plant::create($p));
    }
}
