<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class RoomController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Room::query()->orderBy('room_number');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $perPage = min(max(1, (int) $request->input('per_page', 20)), 500);

        return RoomResource::collection($query->paginate($perPage)->withQueryString());
    }

    public function store(StoreRoomRequest $request): JsonResponse
    {
        $room = Room::create($request->validated());

        return (new RoomResource($room))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Room $room): RoomResource
    {
        return new RoomResource($room);
    }

    public function update(UpdateRoomRequest $request, Room $room): RoomResource
    {
        $room->update($request->validated());

        return new RoomResource($room->fresh());
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->delete();

        return response()->json(null, 204);
    }
}
