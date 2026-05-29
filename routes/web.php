<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::inertia('dashboard/inicio', 'dashboard/inicio')->name('dashboard.inicio');
    Route::inertia('dashboard/nosotros', 'dashboard/nosotros')->name('dashboard.nosotros');
    Route::inertia('dashboard/servicios', 'dashboard/servicios')->name('dashboard.servicios');
    Route::inertia('dashboard/galeria', 'dashboard/galeria')->name('dashboard.galeria');
});

require __DIR__.'/settings.php';
