<?php

namespace App\Http\Controllers;

use App\Models\ServiceFaq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ServiceFaqController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);

        ServiceFaq::query()->create($validated);

        return to_route('dashboard.servicios');
    }

    public function update(Request $request, ServiceFaq $serviceFaq): RedirectResponse
    {
        $validated = $request->validate([
            'question' => ['required', 'string', 'max:255'],
            'answer' => ['required', 'string'],
        ]);

        $serviceFaq->update($validated);

        return to_route('dashboard.servicios');
    }

    public function destroy(ServiceFaq $serviceFaq): RedirectResponse
    {
        $serviceFaq->delete();

        return to_route('dashboard.servicios');
    }
}
