<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGuestRequest;
use App\Http\Requests\UpdateGuestRequest;
use App\Http\Resources\GuestResource;
use App\Models\Guest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GuestController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Guest::query()->orderBy('last_name')->orderBy('first_name');

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        if ($request->filled('q')) {
            $q = '%'.$request->string('q').'%';
            $query->where(function ($builder) use ($q): void {
                $builder
                    ->where('first_name', 'like', $q)
                    ->orWhere('last_name', 'like', $q)
                    ->orWhere('email', 'like', $q)
                    ->orWhere('phone', 'like', $q);
            });
        }

        return GuestResource::collection($query->paginate(20)->withQueryString());
    }

    public function store(StoreGuestRequest $request): JsonResponse
    {
        $guest = Guest::create($request->validated());

        return (new GuestResource($guest))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Guest $guest): GuestResource
    {
        return new GuestResource($guest);
    }

    public function update(UpdateGuestRequest $request, Guest $guest): GuestResource
    {
        $guest->update($request->validated());

        return new GuestResource($guest->fresh());
    }

    public function destroy(Guest $guest): JsonResponse
    {
        $guest->delete();

        return response()->json(null, 204);
    }
}
