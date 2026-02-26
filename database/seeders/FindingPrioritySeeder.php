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
            ],
            [
                "label" => "Minor",
                "description" => "Light anomaly or cosmetic finding with no impact on function.",
                "sla_resolution_hours" => 720,
            ],
            [
                "label" => "Major",
                "description" => "Partial functional failure or significant performance degradation.",
                "sla_resolution_hours" => 168,
            ],
            [
                "label" => "Critical",
                "description" => "Severe anomaly threatening operational continuity.",
                "sla_resolution_hours" => 24,
            ],
            [
                "label" => "Emergency",
                "description" => "Immediate threat to safety, environment, or risk of total asset failure.",
                "sla_resolution_hours" => 4,
            ],
        ];

        collect($finding_priorities)->each(fn($fp) => FindingPriority::create($fp));
    }
}
