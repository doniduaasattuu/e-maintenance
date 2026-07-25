<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plant>
 */
class PlantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => Str::upper('PD-01-' . 'PM' . fake()->numberBetween(1, 9) . '-' . Str::random(3) . '-' . fake()->regexify('[A-Z]{1}[0-9]{3}')),
            'name' => Str::words(3),
        ];
    }
}
