<?php

namespace App\Enums;

enum GuestStatus: string
{
    case VIP = 'VIP';
    case Active = 'Active';
    case Blacklisted = 'Blacklisted';
}
