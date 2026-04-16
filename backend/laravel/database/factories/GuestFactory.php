<?php

namespace Database\Factories;

use App\Enums\GuestStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class GuestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->boolean(80) ? fake()->unique()->safeEmail() : null,
            'phone' => fake()->e164PhoneNumber(),
            'status' => fake()->randomElement([
                GuestStatus::VIP->value,
                GuestStatus::Active->value,
                GuestStatus::Blacklisted->value,
            ]),
        ];
    }
}
