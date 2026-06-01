<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AboutInfoCard;
use App\Models\GalleryCarouselImage;
use App\Models\HomeCarouselImage;
use App\Models\HomeFaq;
use App\Models\HomeInfoCard;
use App\Models\HomeInfoListItem;
use App\Models\HomeStartCard;
use App\Models\ServiceFaq;
use App\Models\ServiceInfoCard;
use Illuminate\Http\JsonResponse;

class PageContentController extends Controller
{
    public function home(): JsonResponse
    {
        return response()->json([
            'carouselImages' => HomeCarouselImage::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeCarouselImage $image) => [
                    'id' => $image->id,
                    'imageUrl' => $this->imageUrl($image->image_path),
                ]),
            'infoCards' => HomeInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => $this->imageUrl($card->image_path),
                ]),
            'listItems' => HomeInfoListItem::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeInfoListItem $item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'description' => $item->description,
                    'imageUrl' => $this->imageUrl($item->image_path),
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

    public function about(): JsonResponse
    {
        return response()->json([
            'startCards' => HomeStartCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (HomeStartCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'imageUrl' => $this->imageUrl($card->image_path),
                ]),
            'infoCards' => AboutInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (AboutInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => $this->imageUrl($card->image_path),
                ]),
        ]);
    }

    public function services(): JsonResponse
    {
        return response()->json([
            'infoCards' => ServiceInfoCard::query()
                ->orderBy('id')
                ->get()
                ->map(fn (ServiceInfoCard $card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'imageUrl' => $this->imageUrl($card->image_path),
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

    public function gallery(): JsonResponse
    {
        return response()->json([
            'carouselImages' => GalleryCarouselImage::query()
                ->orderBy('id')
                ->get()
                ->map(fn (GalleryCarouselImage $image) => [
                    'id' => $image->id,
                    'imageUrl' => $this->imageUrl($image->image_path),
                ]),
        ]);
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset('storage/'.$path) : null;
    }
}