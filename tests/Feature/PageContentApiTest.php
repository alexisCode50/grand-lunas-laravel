<?php

namespace Tests\Feature;

use App\Models\AboutInfoCard;
use App\Models\GalleryCarouselImage;
use App\Models\HomeCarouselImage;
use App\Models\HomeFaq;
use App\Models\HomeInfoCard;
use App\Models\HomeInfoListItem;
use App\Models\HomeStartCard;
use App\Models\ServiceFaq;
use App\Models\ServiceInfoCard;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PageContentApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_endpoint_returns_public_content(): void
    {
        $carouselImage = HomeCarouselImage::query()->create([
            'image_path' => 'home-carousel/hero.jpg',
        ]);
        $infoCard = HomeInfoCard::query()->create([
            'title' => 'Ubicacion privilegiada',
            'description' => 'A pocos minutos de la zona hotelera.',
            'image_path' => 'home-info-cards/card.jpg',
        ]);
        $listItem = HomeInfoListItem::query()->create([
            'title' => 'Piscina',
            'description' => 'Abierta todo el dia.',
            'image_path' => 'home-info-list-items/item.jpg',
        ]);
        $faq = HomeFaq::query()->create([
            'question' => 'Cual es el horario?',
            'answer' => 'Check-in a las 3 PM.',
        ]);

        $this->getJson(route('api.home'))
            ->assertOk()
            ->assertJsonPath('carouselImages.0.id', $carouselImage->id)
            ->assertJsonPath('carouselImages.0.imageUrl', asset('storage/home-carousel/hero.jpg'))
            ->assertJsonPath('infoCards.0.id', $infoCard->id)
            ->assertJsonPath('infoCards.0.title', 'Ubicacion privilegiada')
            ->assertJsonPath('listItems.0.id', $listItem->id)
            ->assertJsonPath('listItems.0.title', 'Piscina')
            ->assertJsonPath('faqs.0.id', $faq->id)
            ->assertJsonPath('faqs.0.question', 'Cual es el horario?');
    }

    public function test_about_endpoint_returns_public_content(): void
    {
        $startCard = HomeStartCard::query()->create([
            'title' => 'Nuestra historia',
            'image_path' => 'home-start-cards/history.jpg',
        ]);
        $infoCard = AboutInfoCard::query()->create([
            'title' => 'Nuestra vision',
            'description' => 'Hospitalidad enfocada en detalle.',
            'image_path' => 'about-info-cards/vision.jpg',
        ]);

        $this->getJson(route('api.about'))
            ->assertOk()
            ->assertJsonPath('startCards.0.id', $startCard->id)
            ->assertJsonPath('startCards.0.imageUrl', asset('storage/home-start-cards/history.jpg'))
            ->assertJsonPath('infoCards.0.id', $infoCard->id)
            ->assertJsonPath('infoCards.0.title', 'Nuestra vision');
    }

    public function test_services_endpoint_returns_public_content(): void
    {
        $infoCard = ServiceInfoCard::query()->create([
            'title' => 'Spa premium',
            'description' => 'Tratamientos y bienestar.',
            'image_path' => 'service-info-cards/spa.jpg',
        ]);
        $faq = ServiceFaq::query()->create([
            'question' => 'Incluye desayuno?',
            'answer' => 'Si, esta incluido.',
        ]);

        $this->getJson(route('api.services'))
            ->assertOk()
            ->assertJsonPath('infoCards.0.id', $infoCard->id)
            ->assertJsonPath('infoCards.0.imageUrl', asset('storage/service-info-cards/spa.jpg'))
            ->assertJsonPath('faqs.0.id', $faq->id)
            ->assertJsonPath('faqs.0.answer', 'Si, esta incluido.');
    }

    public function test_gallery_endpoint_returns_public_content(): void
    {
        $image = GalleryCarouselImage::query()->create([
            'image_path' => 'gallery-carousel/photo.jpg',
        ]);

        $this->getJson(route('api.gallery'))
            ->assertOk()
            ->assertJsonPath('carouselImages.0.id', $image->id)
            ->assertJsonPath('carouselImages.0.imageUrl', asset('storage/gallery-carousel/photo.jpg'));
    }
}