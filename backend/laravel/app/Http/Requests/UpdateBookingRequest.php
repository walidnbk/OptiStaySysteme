<?php

namespace App\Http\Requests;

use App\Enums\BookingStatus;
use App\Models\Booking;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'guest_id' => ['sometimes', 'integer', 'exists:guests,id'],
            'room_id' => ['sometimes', 'integer', 'exists:rooms,id'],
            'check_in' => ['sometimes', 'date'],
            'check_out' => ['sometimes', 'date'],
            'status' => ['sometimes', Rule::enum(BookingStatus::class)],
            'total_amount' => ['sometimes', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Booking|null $booking */
            $booking = $this->route('booking');
            if (! $booking instanceof Booking) {
                return;
            }

            $checkIn = $this->input('check_in', $booking->check_in?->toDateString());
            $checkOut = $this->input('check_out', $booking->check_out?->toDateString());

            if ($checkIn && $checkOut && strtotime((string) $checkOut) <= strtotime((string) $checkIn)) {
                $validator->errors()->add('check_out', 'The check out date must be after the check in date.');
            }
        });
    }
}
