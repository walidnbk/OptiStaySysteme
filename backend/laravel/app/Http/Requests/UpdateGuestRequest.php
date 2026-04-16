<?php

namespace App\Http\Requests;

use App\Enums\GuestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGuestRequest extends FormRequest
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
        $guestId = $this->route('guest');

        return [
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('guests', 'email')->ignore($guestId),
            ],
            'phone' => ['sometimes', 'string', 'max:30'],
            'status' => ['sometimes', Rule::enum(GuestStatus::class)],
        ];
    }
}
