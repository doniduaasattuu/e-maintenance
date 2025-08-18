<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InspectionAirConditioner>
 */
class InspectionAirConditionerFactory extends Factory
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
            'is_drain_leaking' => Arr::random([0, 1]),
            'current_load' => fake()->numberBetween(10, 50),
            'blowing_temperature' => fake()->numberBetween(16, 30),
            'ambient_temperature' => fake()->numberBetween(16, 40),
            'is_filter_clean' => Arr::random([0, 1]),
            'is_evaporator_clean' => Arr::random([0, 1]),
            'is_condensor_clean' => Arr::random([0, 1]),
        ];
    }
}
