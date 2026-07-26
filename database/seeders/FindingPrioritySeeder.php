<?php

namespace Database\Seeders;

use App\Models\FindingPriority;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FindingPrioritySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $finding_priorities = [
            [
                "label" => "Recommendation",
                "description" => "Suggestions for reliability or maintenance optimization.",
                "sla_resolution_hours" => null,
                "color_code" =>  "#31e981",
                'minimum_point' => 0,
                'maximum_point' => 2,
            ],
            [
                "label" => "Minor",
                "description" => "Light anomaly or cosmetic finding with no impact on function.",
                "sla_resolution_hours" => 720,
                "color_code" => "#2563EB",
                'minimum_point' => 3,
                'maximum_point' => 5,
            ],
            [
                "label" => "Major",
                "description" => "Partial functional failure or significant performance degradation.",
                "sla_resolution_hours" => 168,
                "color_code" => "#CA8A04",
                'minimum_point' => 6,
                'maximum_point' => 9,
            ],
            [
                "label" => "Critical",
                "description" => "Severe anomaly threatening operational continuity.",
                "sla_resolution_hours" => 24,
                "color_code" => "#EA580C",
                'minimum_point' => 10,
                'maximum_point' => 12,
            ],
            [
                "label" => "Emergency",
                "description" => "Immediate threat to safety, environment, or risk of total asset failure.",
                "sla_resolution_hours" => 4,
                "color_code" => "#B91C1C",
                'minimum_point' => 13,
                'maximum_point' => 15,
            ],
        ];

        collect($finding_priorities)->each(fn($fp) => FindingPriority::create($fp));
    }
}
