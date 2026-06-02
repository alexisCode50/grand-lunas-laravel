<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PageContentController;

Route::get('/home', [PageContentController::class, 'home'])->name('api.home');
Route::get('/about', [PageContentController::class, 'about'])->name('api.about');
Route::get('/services', [PageContentController::class, 'services'])->name('api.services');
Route::get('/gallery', [PageContentController::class, 'gallery'])->name('api.gallery');
