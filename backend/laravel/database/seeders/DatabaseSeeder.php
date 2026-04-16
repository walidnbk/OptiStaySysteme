<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->create([
            'name' => 'OptiStay Admin',
            'email' => 'admin@optistay.com',
            'password' => Hash::make('password'),
            'role' => UserRole::Admin->value,
            'avatar_url' => null,
        ]);

        User::factory()->count(5)->create();
        Room::factory()->count(20)->create();
        Guest::factory()->count(15)->create();
        Booking::factory()->count(30)->create();
    }
}
