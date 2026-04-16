<?php

namespace App\Http\Requests;

use App\Enums\RoomStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRoomRequest extends FormRequest
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
        $roomId = $this->route('room');

        return [
            'room_number' => [
                'sometimes',
                'string',
                'max:50',
                Rule::unique('rooms', 'room_number')->ignore($roomId),
            ],
            'type' => ['sometimes', 'string', 'max:100'],
            'capacity' => ['sometimes', 'integer', 'min:1', 'max:50'],
            'price_per_night' => ['sometimes', 'numeric', 'min:0', 'regex:/^\d+(\.\d{1,2})?$/'],
            'status' => ['sometimes', Rule::enum(RoomStatus::class)],
        ];
    }
}
