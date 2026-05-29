<?php

namespace App\Http\Controllers;

use App\Models\HomeCarouselImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomeCarouselController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/inicio', [
            'carouselImages' => HomeCarouselImage::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeCarouselImage $image) => [
                    'id' => $image->id,
                    'imageUrl' => asset('storage/'.$image->image_path),
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'images' => ['required', 'array', 'min:1'],
            'images.*' => ['required', 'image', 'max:5120'],
        ]);

        foreach ($validated['images'] as $image) {
            HomeCarouselImage::query()->create([
                'image_path' => $image->store('home-carousel', 'public'),
            ]);
        }

        return to_route('dashboard.inicio');
    }

    public function destroy(HomeCarouselImage $homeCarouselImage): RedirectResponse
    {
        Storage::disk('public')->delete($homeCarouselImage->image_path);
        $homeCarouselImage->delete();

        return to_route('dashboard.inicio');
    }
}