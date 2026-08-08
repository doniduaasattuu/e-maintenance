<?php

namespace Database\Seeders;

use App\Models\ImprovementStatus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ImprovementStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Submitted',
                'color' => '#3B82F6',
                'sequence' => 1,

            ],
            [
                'name' => 'Approved',
                'color' => '#8B5CF6',
                'sequence' => 2,
            ],
            [
                'name' => 'Implemented',
                'color' => '#22C55E',
                'sequence' => 3,
            ],
            [
                'name' => 'Verified',
                'color' => '#10B981',
                'sequence' => 4,
            ],
            [
                'name' => 'Rejected',
                'color' => '#EF4444',
                'sequence' => 5,
            ],
        ];


        foreach ($statuses as $status) {
            ImprovementStatus::updateOrCreate(
                ['name' => $status['name']],
                $status
            );
        }
    }
}
