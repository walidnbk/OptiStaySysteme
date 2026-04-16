<?php

namespace Database\Factories;

use App\Enums\RoomStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class RoomFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(['Single', 'Double', 'Suite']);

        return [
            'room_number' => strtoupper(fake()->unique()->bothify('R-##??')),
            'type' => $type,
            'capacity' => match ($type) {
                'Single' => 1,
                'Double' => fake()->numberBetween(2, 3),
                'Suite' => fake()->numberBetween(3, 5),
            },
            'price_per_night' => match ($type) {
                'Single' => fake()->randomFloat(2, 45, 90),
                'Double' => fake()->randomFloat(2, 80, 150),
                'Suite' => fake()->randomFloat(2, 160, 350),
            },
            'status' => fake()->randomElement([
                RoomStatus::Available->value,
                RoomStatus::Occupied->value,
                RoomStatus::Maintenance->value,
            ]),
        ];
    }
}
