<?php

namespace Database\Factories;

use App\Models\Equipment;
use App\Models\FindingClause;
use App\Models\FindingPriority;
use App\Models\FindingStatus;
use App\Models\FunctionalLocation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Finding>
 */
class FindingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $industrialFindings = [
            'Found oil leakage on the main gearbox housing, potential seal failure.',
            'High vibration detected on motor drive end, exceeding 7.1 mm/s threshold.',
            'Corrosion detected on support structure beam C-12, requires immediate painting.',
            'Electrical panel terminal 4 overheated (detected by thermal scan: 85°C).',
            'Abnormal noise (grinding sound) coming from conveyor belt idlers.',
            'Loose mounting bolts on hydraulic pump unit, causing slight misalignment.',
            'Safety guard missing on rotating shaft after previous maintenance activity.',
            'Dust accumulation inside the VFD panel, risk of short circuit.',
        ];

        return [
            'finding_clause_id' => FindingClause::inRandomOrder()->first()->id,
            'finding_status_id' => FindingStatus::inRandomOrder()->first()->id,
            'finding_priority_id' => FindingPriority::inRandomOrder()->first()->id,
            'equipment_id' => Equipment::inRandomOrder()->first()->id ?? Equipment::factory(),
            'functional_location_id' => FunctionalLocation::inRandomOrder()->first()->id ?? FunctionalLocation::factory(),
            'description' => $this->faker->randomElement($industrialFindings),
            'notification' => $this->faker->numerify('########'),
            'inspected_by' => User::inRandomOrder()->first()->id ?? User::factory(),
            'verified_by' => null,
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'closed_at' => null,
        ];
    }
}
