<?php

namespace Database\Factories;

use App\Enums\BookingStatus;
use App\Models\Guest;
use App\Models\Room;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    public function definition(): array
    {
        $checkIn = Carbon::instance(fake()->dateTimeBetween('-45 days', '+45 days'))->startOfDay();
        $nights = fake()->numberBetween(1, 10);
        $checkOut = (clone $checkIn)->addDays($nights);

        $status = match (true) {
            $checkOut->isPast() => fake()->randomElement([BookingStatus::Confirmed->value, BookingStatus::Cancelled->value]),
            $checkIn->isFuture() => fake()->randomElement([BookingStatus::Pending->value, BookingStatus::Confirmed->value]),
            default => BookingStatus::Confirmed->value,
        };

        $room = Room::query()->inRandomOrder()->first() ?? Room::factory()->create();
        $guest = Guest::query()->inRandomOrder()->first() ?? Guest::factory()->create();

        return [
            'guest_id' => $guest->id,
            'room_id' => $room->id,
            'check_in' => $checkIn->toDateString(),
            'check_out' => $checkOut->toDateString(),
            'status' => $status,
            'total_amount' => number_format((float) $room->price_per_night * $nights, 2, '.', ''),
        ];
    }
}
