<?php

namespace App\Http\Controllers;

use App\Models\GalleryCarouselImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class GalleryCarouselController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('dashboard/galeria', [
            'carouselImages' => GalleryCarouselImage::query()
                ->orderBy('id')
                ->get()
                ->map(fn (GalleryCarouselImage $image) => [
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
            GalleryCarouselImage::query()->create([
                'image_path' => $image->store('gallery-carousel', 'public'),
            ]);
        }

        return to_route('dashboard.galeria');
    }

    public function destroy(GalleryCarouselImage $galleryCarouselImage): RedirectResponse
    {
        Storage::disk('public')->delete($galleryCarouselImage->image_path);
        $galleryCarouselImage->delete();

        return to_route('dashboard.galeria');
    }
}