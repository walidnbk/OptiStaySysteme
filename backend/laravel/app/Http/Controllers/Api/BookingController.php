<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookingController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Booking::query()
            ->with(['guest', 'room'])
            ->orderByDesc('check_in');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('guest_id')) {
            $query->where('guest_id', $request->integer('guest_id'));
        }

        if ($request->filled('room_id')) {
            $query->where('room_id', $request->integer('room_id'));
        }

        $perPage = min(max(1, (int) $request->input('per_page', 20)), 500);

        return BookingResource::collection($query->paginate($perPage)->withQueryString());
    }

    public function store(StoreBookingRequest $request): JsonResponse
    {
        $booking = Booking::create($request->validated());
        $booking->load(['guest', 'room']);

        return (new BookingResource($booking))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Booking $booking): BookingResource
    {
        $booking->load(['guest', 'room']);

        return new BookingResource($booking);
    }

    public function update(UpdateBookingRequest $request, Booking $booking): BookingResource
    {
        $booking->update($request->validated());

        return new BookingResource($booking->fresh(['guest', 'room']));
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();

        return response()->json(null, 204);
    }
}
