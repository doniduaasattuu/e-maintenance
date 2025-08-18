<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Arr;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InspectionMotor>
 */
class InspectionMotorFactory extends Factory
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
            'number_of_greasing' => fake()->randomNumber() * 10,
            'temperature_de' => fake()->numberBetween(30, 70),
            'temperature_body' => fake()->numberBetween(30, 70),
            'temperature_nde' => fake()->numberBetween(30, 70),
            'vibration_dev' => fake()->numberBetween(0, 45) / 10,
            'vibration_deh' => fake()->numberBetween(0, 45) / 10,
            'vibration_dea' => fake()->numberBetween(0, 45) / 10,
            'vibration_def' => fake()->numberBetween(0, 45) / 10,
            'is_noisy_de' => Arr::random([0, 1]),
            'vibration_ndev' => fake()->numberBetween(0, 45) / 10,
            'vibration_ndeh' => fake()->numberBetween(0, 45) / 10,
            'vibration_ndef' => fake()->numberBetween(0, 45) / 10,
            'is_noisy_nde' => Arr::random([0, 1]),
        ];
    }
}
