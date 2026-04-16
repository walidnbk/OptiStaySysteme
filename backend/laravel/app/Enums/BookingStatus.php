<?php

namespace App\Enums;

enum BookingStatus: string
{
    case Confirmed = 'Confirmed';
    case Pending = 'Pending';
    case Cancelled = 'Cancelled';
}
