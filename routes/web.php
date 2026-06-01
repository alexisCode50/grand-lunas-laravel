<?php

use App\Http\Controllers\AboutInfoCardController;
use App\Http\Controllers\HomeCarouselController;
use App\Http\Controllers\HomeStartCardController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('dashboard/inicio', [HomeCarouselController::class, 'index'])->name('dashboard.inicio');
    Route::post('dashboard/inicio/carrusel', [HomeCarouselController::class, 'store'])->name('dashboard.inicio.carousel.store');
    Route::delete('dashboard/inicio/carrusel/{homeCarouselImage}', [HomeCarouselController::class, 'destroy'])
        ->name('dashboard.inicio.carousel.destroy');
    Route::post('dashboard/inicio/tarjetas', [HomeCarouselController::class, 'storeInfoCard'])
        ->name('dashboard.inicio.info-cards.store');
    Route::put('dashboard/inicio/tarjetas/{homeInfoCard}', [HomeCarouselController::class, 'updateInfoCard'])
        ->name('dashboard.inicio.info-cards.update');
    Route::delete('dashboard/inicio/tarjetas/{homeInfoCard}', [HomeCarouselController::class, 'destroyInfoCard'])
        ->name('dashboard.inicio.info-cards.destroy');
    Route::post('dashboard/inicio/listado', [HomeCarouselController::class, 'storeListItem'])
        ->name('dashboard.inicio.list-items.store');
    Route::put('dashboard/inicio/listado/{homeInfoListItem}', [HomeCarouselController::class, 'updateListItem'])
        ->name('dashboard.inicio.list-items.update');
    Route::delete('dashboard/inicio/listado/{homeInfoListItem}', [HomeCarouselController::class, 'destroyListItem'])
        ->name('dashboard.inicio.list-items.destroy');
    Route::post('dashboard/inicio/faqs', [HomeCarouselController::class, 'storeFaq'])
        ->name('dashboard.inicio.faqs.store');
    Route::put('dashboard/inicio/faqs/{homeFaq}', [HomeCarouselController::class, 'updateFaq'])
        ->name('dashboard.inicio.faqs.update');
    Route::delete('dashboard/inicio/faqs/{homeFaq}', [HomeCarouselController::class, 'destroyFaq'])
        ->name('dashboard.inicio.faqs.destroy');
    Route::get('dashboard/nosotros', [HomeStartCardController::class, 'index'])->name('dashboard.nosotros');
    Route::post('dashboard/nosotros/tarjetas-inicio', [HomeStartCardController::class, 'store'])
        ->name('dashboard.nosotros.start-cards.store');
    Route::put('dashboard/nosotros/tarjetas-inicio/{homeStartCard}', [HomeStartCardController::class, 'update'])
        ->name('dashboard.nosotros.start-cards.update');
    Route::delete('dashboard/nosotros/tarjetas-inicio/{homeStartCard}', [HomeStartCardController::class, 'destroy'])
        ->name('dashboard.nosotros.start-cards.destroy');
    Route::post('dashboard/nosotros/tarjetas-informacion', [AboutInfoCardController::class, 'store'])
        ->name('dashboard.nosotros.info-cards.store');
    Route::put('dashboard/nosotros/tarjetas-informacion/{aboutInfoCard}', [AboutInfoCardController::class, 'update'])
        ->name('dashboard.nosotros.info-cards.update');
    Route::delete('dashboard/nosotros/tarjetas-informacion/{aboutInfoCard}', [AboutInfoCardController::class, 'destroy'])
        ->name('dashboard.nosotros.info-cards.destroy');
    Route::inertia('dashboard/servicios', 'dashboard/servicios')->name('dashboard.servicios');
    Route::inertia('dashboard/galeria', 'dashboard/galeria')->name('dashboard.galeria');
});

require __DIR__.'/settings.php';
