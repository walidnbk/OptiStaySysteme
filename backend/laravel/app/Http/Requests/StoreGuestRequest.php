<?php

namespace App\Http\Requests;

use App\Enums\GuestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGuestRequest extends FormRequest
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
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['nullable', 'email', 'max:255', 'unique:guests,email'],
            'phone' => ['required', 'string', 'max:30'],
            'status' => ['required', Rule::enum(GuestStatus::class)],
        ];
    }
}
