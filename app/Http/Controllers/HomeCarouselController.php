<?php

namespace App\Http\Controllers;

use App\Models\HomeCarouselImage;
use App\Models\HomeFaq;
use App\Models\HomeInfoCard;
use App\Models\HomeInfoListItem;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class HomeCarouselController extends Controller
{
    private const MAX_HOME_INFO_CARDS = 3;

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
            'infoCards' => HomeInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => $card->image_path ? asset('storage/'.$card->image_path) : null,
                ]),
            'listItems' => HomeInfoListItem::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeInfoListItem $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'imageUrl' => $item->image_path ? asset('storage/'.$item->image_path) : null,
                ]),
            'faqs' => HomeFaq::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeFaq $faq) => [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
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

    public function storeInfoCard(Request $request): RedirectResponse
    {
        if (HomeInfoCard::query()->count() >= self::MAX_HOME_INFO_CARDS) {
            return back()->withErrors([
                'title' => 'Solo se permiten 3 tarjetas de información en la página de inicio.',
            ]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image', 'max:5120'],
        ]);

        HomeInfoCard::query()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $request->file('image')->store('home-info-cards', 'public'),
        ]);

        return to_route('dashboard.inicio');
    }

    public function updateInfoCard(Request $request, HomeInfoCard $homeInfoCard): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'max:5120'],
        ]);

        $imagePath = $homeInfoCard->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('home-info-cards', 'public');
        }

        $homeInfoCard->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);

        return to_route('dashboard.inicio');
    }

    public function destroyInfoCard(HomeInfoCard $homeInfoCard): RedirectResponse
    {
        if ($homeInfoCard->image_path) {
            Storage::disk('public')->delete($homeInfoCard->image_path);
        }

        $homeInfoCard->delete();

        return to_route('dashboard.inicio');
    }

    public function storeListItem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image', 'max:5120'],
        ]);

        HomeInfoListItem::query()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $request->file('image')->store('home-info-list-items', 'public'),
        ]);

        return to_route('dashboard.inicio');
    }

    public function updateListItem(Request $request, HomeInfoListItem $homeInfoListItem): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [Rule::requiredIf(!$homeInfoListItem->image_path), 'nullable', 'image', 'max:5120'],
        ]);

        $imagePath = $homeInfoListItem->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('home-info-list-items', 'public');
        }

        $homeInfoListItem->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);

        return to_route('dashboard.inicio');
    }

    public function destroyListItem(HomeInfoListItem $homeInfoListItem): RedirectResponse
    {
        if ($homeInfoListItem->image_path) {
            Storage::disk('public')->delete($homeInfoListItem->image_path);
        }

        $homeInfoListItem->delete();

        return to_route('dashboard.inicio');
    }

    public function storeFaq(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);

        HomeFaq::query()->create($validated);

        return to_route('dashboard.inicio');
    }

    public function updateFaq(Request $request, HomeFaq $homeFaq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);

        $homeFaq->update($validated);

        return to_route('dashboard.inicio');
    }

    public function destroyFaq(HomeFaq $homeFaq): RedirectResponse
    {
        $homeFaq->delete();

        return to_route('dashboard.inicio');
    }
}