<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InspectionPanel>
 */
class InspectionPanelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'is_operational' => 1,
            'is_clean' => 1,
            'temperature_incoming_r' => fake()->numberBetween(30, 70),
            'temperature_incoming_s' => fake()->numberBetween(30, 70),
            'temperature_incoming_t' => fake()->numberBetween(30, 70),
            'temperature_cabinet' => fake()->numberBetween(30, 70),
            'temperature_outgoing_r' => fake()->numberBetween(30, 70),
            'temperature_outgoing_s' => fake()->numberBetween(30, 70),
            'temperature_outgoing_t' => fake()->numberBetween(30, 70),
            'current_r' => fake()->numberBetween(10, 30),
            'current_s' => fake()->numberBetween(10, 30),
            'current_t' => fake()->numberBetween(10, 30),
        ];
    }
}
