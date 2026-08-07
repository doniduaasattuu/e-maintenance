<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\FindingType>
 */
class FindingTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => 'FT' . Str::upper(fake()->randomLetter() . fake()->unique()->numerify('###')),
            'name' => fake()->words(2),
            'description' => Str::ucfirst(fake()->sentence(5)),
        ];
    }
}
