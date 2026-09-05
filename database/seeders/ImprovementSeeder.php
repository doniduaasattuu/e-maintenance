<?php

namespace Database\Seeders;

use App\Models\Improvement;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImprovementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Improvement::factory()
            ->count(50)
            ->create();
    }
}
