<?php

namespace Database\Seeders;

use App\Models\FunctionalLocation;
use App\Models\WorkCenter;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FunctionalLocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        FunctionalLocation::factory()
            ->count(20)
            ->create();
    }
}
