<?php

namespace Database\Seeders;

use App\Models\Finding;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Finding::factory()
            ->count(50)
            ->create();
    }
}
