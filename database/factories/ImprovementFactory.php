<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Equipment;
use App\Models\FunctionalLocation;
use App\Models\ImprovementCategory;
use App\Models\ImprovementStatus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Improvement>
 */
class ImprovementFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'functional_location_id' =>  FunctionalLocation::all()->random()->id ?? FunctionalLocation::factory()->create()->id,
            'equipment_id' => Equipment::all()->random()->id ?? Equipment::factory()->create()->id,
            'department_id' => Department::all()->random()->id ?? Department::factory()->create()->id,

            'improvement_category_id' => ImprovementCategory::all()->random()->id ?? ImprovementCategory::factory()->create()->id,
            'improvement_status_id' => ImprovementStatus::all()->random()->id ?? ImprovementStatus::factory()->create()->id,

            'code' => 'IMP-' . fake()->unique()->numerify('####'),
            'title' => Str::ucfirst(fake()->words(4, true)),

            'problem' => fake()->paragraph(),
            'description' => fake()->paragraph(),
            'root_cause' => fake()->paragraph(),

            'expected_benefit' => fake()->paragraph(),
            'actual_benefit' => fake()->paragraph(),

            'implementation_date' => Carbon::now()->subDays(random_int(0, 30))->startOfDay()->addSeconds(random_int(0, 86399)),

            'remarks' => fake()->optional()->sentence(),

            'created_by' => User::all()->random()->id ?? User::factory()->create()->id,
            'approved_by' => User::all()->random()->id ?? User::factory()->create()->id,
        ];
    }
}
