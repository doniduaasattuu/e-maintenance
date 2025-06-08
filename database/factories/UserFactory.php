<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Position;
use App\Models\WorkCenter;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => fake()->randomNumber(8, true),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'phone_number' => fake()->regexify('\+628[1-9]{1}[0-9]{7,10}'),
            'password' => static::$password ??= Hash::make('password'),
            'department_id' => Department::inRandomOrder()->first(),
            'position_id' => Position::inRandomOrder()->first(),
            'work_center_id' => WorkCenter::inRandomOrder()->first(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
