<?php

namespace App\Http\Controllers;

use App\Models\ServiceFaq;
use App\Models\ServiceInfoCard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ServiceInfoCardController extends Controller
{
    private const MAX_INFO_CARDS = 3;

    public function index(): Response
    {
        return Inertia::render('dashboard/servicios', [
            'infoCards' => ServiceInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (ServiceInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => asset('storage/'.$card->image_path),
                ]),
            'faqs' => ServiceFaq::query()
                ->orderBy('id')
                ->get()
                ->map(fn (ServiceFaq $faq) => [
                    'id' => $faq->id,
                    'question' => $faq->question,
                    'answer' => $faq->answer,
                ]),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (ServiceInfoCard::query()->count() >= self::MAX_INFO_CARDS) {
            return back()->withErrors([
                'title' => 'Solo se permiten 3 tarjetas con información en la página de servicios.',
            ]);
        }

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => ['required', 'image', 'max:5120'],
        ]);

        ServiceInfoCard::query()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $request->file('image')->store('service-info-cards', 'public'),
        ]);

        return to_route('dashboard.servicios');
    }

    public function update(Request $request, ServiceInfoCard $serviceInfoCard): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image' => [Rule::requiredIf(!$serviceInfoCard->image_path), 'nullable', 'image', 'max:5120'],
        ]);

        $imagePath = $serviceInfoCard->image_path;

        if ($request->hasFile('image')) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            $imagePath = $request->file('image')->store('service-info-cards', 'public');
        }

        $serviceInfoCard->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image_path' => $imagePath,
        ]);

        return to_route('dashboard.servicios');
    }

    public function destroy(ServiceInfoCard $serviceInfoCard): RedirectResponse
    {
        if ($serviceInfoCard->image_path) {
            Storage::disk('public')->delete($serviceInfoCard->image_path);
        }

        $serviceInfoCard->delete();

        return to_route('dashboard.servicios');
    }
}