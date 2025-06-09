<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            [
                'code' => 'ENG',
                'name' => 'Engineering',
            ],
            [
                'code' => 'PRD',
                'name' => 'Production',
            ],
        ];

        collect($divisions)->each(fn($d) => Division::create($d));
    }
}
