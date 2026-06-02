<?php

namespace App\Http\Controllers;

use App\Models\AboutInfoCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AboutInfoCardController extends Controller
{
    private const MAX_INFO_CARDS = 50;

    public function store(Request $request): RedirectResponse
    {
        if (AboutInfoCard::query()->count() >= self::MAX_INFO_CARDS) {
            return back()->withErrors([
                'title' => 'Solo se permiten 3 tarjetas con información en la página de nosotros.',
            ]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [
                'required', 
                'file', 
                'mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif', 
                'extensions:jpg,jpeg,png,webp,gif,svg,avif', 
                'max:5120'
            ],
        ]);

        AboutInfoCard::query()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $request->file('image')->store('about-info-cards', 'public'),
        ]);

        return to_route('dashboard.nosotros');
    }

    public function update(Request $request, AboutInfoCard $aboutInfoCard): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [
                Rule::requiredIf(!$aboutInfoCard->image_path), 
                'nullable', 
                'file', 
                'mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif', 
                'extensions:jpg,jpeg,png,webp,gif,svg,avif', 
                'max:5120'
            ],
        ]);

        $imagePath = $aboutInfoCard->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('about-info-cards', 'public');
        }

        $aboutInfoCard->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);

        return to_route('dashboard.nosotros');
    }

    public function destroy(AboutInfoCard $aboutInfoCard): RedirectResponse
    {
        if ($aboutInfoCard->image_path) {
            Storage::disk('public')->delete($aboutInfoCard->image_path);
        }

        $aboutInfoCard->delete();

        return to_route('dashboard.nosotros');
    }
}