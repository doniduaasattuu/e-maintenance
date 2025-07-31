<?php

namespace Database\Factories;

use App\Models\QualityRating;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InspectionTransformer>
 */
class InspectionTransformerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_operational' => Arr::random([0, 1]),
            'is_clean' => Arr::random([0, 1]),
            'primary_current_r' => fake()->numberBetween(389, 400),
            'primary_current_s' => fake()->numberBetween(389, 400),
            'primary_current_t' => fake()->numberBetween(389, 400),
            'primary_voltage_r' => fake()->numberBetween(19000, 20000),
            'primary_voltage_s' => fake()->numberBetween(19000, 20000),
            'primary_voltage_t' => fake()->numberBetween(19000, 20000),
            'secondary_current_r' => fake()->numberBetween(2000, 2500),
            'secondary_current_s' => fake()->numberBetween(2000, 2500),
            'secondary_current_t' => fake()->numberBetween(2000, 2500),
            'secondary_voltage_r' => fake()->numberBetween(60, 75),
            'secondary_voltage_s' => fake()->numberBetween(60, 75),
            'secondary_voltage_t' => fake()->numberBetween(60, 75),
            'temperature_oil' => fake()->numberBetween(30, 70),
            'temperature_winding' => fake()->numberBetween(30, 70),
            'desicant_level_id' => QualityRating::all()->random()->id,
        ];
    }
}
