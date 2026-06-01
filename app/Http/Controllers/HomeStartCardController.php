<?php

namespace App\Http\Controllers;

use App\Models\AboutInfoCard;
use App\Models\HomeStartCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HomeStartCardController extends Controller
{
    private const MAX_START_CARDS = 3;

    public function index(): Response
    {
        return Inertia::render('dashboard/nosotros', [
            'startCards' => HomeStartCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeStartCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'imageUrl' => asset('storage/'.$card->image_path),
                ]),
            'infoCards' => AboutInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (AboutInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => asset('storage/'.$card->image_path),
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (HomeStartCard::query()->count() >= self::MAX_START_CARDS) {
            return back()->withErrors([
                'title' => 'Solo se permiten 3 tarjetas de inicio en la página de nosotros.',
            ]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => [
                'required', 
                'file', 
                'mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif', 
                'extensions:jpg,jpeg,png,webp,gif,svg,avif', 
                'max:5120'
            ],
        ]);

        HomeStartCard::query()->create([
            'title' => $validated['title'],
            'image_path' => $request->file('image')->store('home-start-cards', 'public'),
        ]);

        return to_route('dashboard.nosotros');
    }

    public function update(Request $request, HomeStartCard $homeStartCard): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'image' => [
                Rule::requiredIf(!$homeStartCard->image_path), 
                'nullable', 
                'file', 
                'mimetypes:image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif', 
                'extensions:jpg,jpeg,png,webp,gif,svg,avif', 
                'max:5120'
            ],
        ]);

        $imagePath = $homeStartCard->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('home-start-cards', 'public');
        }

        $homeStartCard->update([
            'title' => $validated['title'],
            'image_path' => $imagePath,
        ]);

        return to_route('dashboard.nosotros');
    }

    public function destroy(HomeStartCard $homeStartCard): RedirectResponse
    {
        if ($homeStartCard->image_path) {
            Storage::disk('public')->delete($homeStartCard->image_path);
        }

        $homeStartCard->delete();

        return to_route('dashboard.nosotros');
    }
}