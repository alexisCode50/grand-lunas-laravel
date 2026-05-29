<?php

use App\Http\Controllers\HomeCarouselController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard/inicio', [HomeCarouselController::class, 'index'])->name('dashboard.inicio');
    Route::post('dashboard/inicio/carrusel', [HomeCarouselController::class, 'store'])->name('dashboard.inicio.carousel.store');
    Route::delete('dashboard/inicio/carrusel/{homeCarouselImage}', [HomeCarouselController::class, 'destroy'])
        ->name('dashboard.inicio.carousel.destroy');
    Route::inertia('dashboard/nosotros', 'dashboard/nosotros')->name('dashboard.nosotros');
    Route::inertia('dashboard/servicios', 'dashboard/servicios')->name('dashboard.servicios');
    Route::inertia('dashboard/galeria', 'dashboard/galeria')->name('dashboard.galeria');
});

require __DIR__.'/settings.php';
