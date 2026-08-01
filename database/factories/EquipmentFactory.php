<?php

namespace Database\Factories;

use App\Models\EquipmentClass;
use App\Models\EquipmentStatus;
use App\Models\EquipmentType;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $equipmentClass = EquipmentClass::factory()->create();

        return [
            'code' => Str::upper(fake()->lexify('???')) . fake()->numerify('######'),
            'sort_field' => Str::upper(fake()->sentence(2)),
            'description' => Str::ucfirst(fake()->sentence(4)),
            'equipment_class_id' => $equipmentClass->id,
            'equipment_status_id' => EquipmentStatus::factory()->create()->id,
            'equipment_type_id' => EquipmentType::factory()->create([
                'equipment_class_id' => $equipmentClass->id,
            ])->id,
        ];
    }
}
