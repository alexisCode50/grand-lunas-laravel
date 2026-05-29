<?php

namespace Tests\Feature;

use App\Models\HomeCarouselImage;
use App\Models\HomeFaq;
use App\Models\HomeInfoCard;
use App\Models\HomeInfoListItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page()
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response->assertOk();
    }

    public function test_authenticated_users_can_manage_home_carousel_images()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $this->get(route('dashboard.inicio'))->assertOk();

        $this->post(route('dashboard.inicio.carousel.store'), [
            'images' => [UploadedFile::fake()->image('carousel.jpg')],
        ])->assertRedirect(route('dashboard.inicio'));

        $image = HomeCarouselImage::query()->first();

        $this->assertNotNull($image);
        $this->assertTrue(Storage::disk('public')->exists($image->image_path));

        $this->delete(route('dashboard.inicio.carousel.destroy', $image))
            ->assertRedirect(route('dashboard.inicio'));

        $this->assertDatabaseEmpty('home_carousel_images');
        $this->assertFalse(Storage::disk('public')->exists($image->image_path));
    }

    public function test_authenticated_users_can_manage_home_info_cards()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('dashboard.inicio.info-cards.store'), [
            'title' => 'Ubicacion privilegiada',
            'description' => 'A pocos minutos de los principales atractivos turisticos.',
            'image' => UploadedFile::fake()->image('card.jpg'),
        ])->assertRedirect(route('dashboard.inicio'));

        $card = HomeInfoCard::query()->first();

        $this->assertNotNull($card);
        $this->assertSame('Ubicacion privilegiada', $card->title);
        $this->assertTrue(Storage::disk('public')->exists($card->image_path));

        $this->put(route('dashboard.inicio.info-cards.update', $card), [
            'title' => 'Nueva ubicacion',
            'description' => 'Descripcion actualizada.',
        ])->assertRedirect(route('dashboard.inicio'));

        $card->refresh();

        $this->assertSame('Nueva ubicacion', $card->title);
        $this->assertNotNull($card->image_path);

        $this->delete(route('dashboard.inicio.info-cards.destroy', $card))
            ->assertRedirect(route('dashboard.inicio'));

        $this->assertDatabaseEmpty('home_info_cards');
    }

    public function test_authenticated_users_cannot_create_more_than_three_home_info_cards()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        HomeInfoCard::query()->create([
            'title' => 'Tarjeta 1',
            'description' => 'Descripcion 1',
        ]);

        HomeInfoCard::query()->create([
            'title' => 'Tarjeta 2',
            'description' => 'Descripcion 2',
        ]);

        HomeInfoCard::query()->create([
            'title' => 'Tarjeta 3',
            'description' => 'Descripcion 3',
        ]);

        $this->from(route('dashboard.inicio'))
            ->post(route('dashboard.inicio.info-cards.store'), [
                'title' => 'Tarjeta 4',
                'description' => 'Descripcion 4',
                'image' => UploadedFile::fake()->image('card-4.jpg'),
            ])
            ->assertRedirect(route('dashboard.inicio'))
            ->assertSessionHasErrors([
                'title' => 'Solo se permiten 3 tarjetas de informacion en la pagina de inicio.',
            ]);

        $this->assertSame(3, HomeInfoCard::query()->count());
    }

    public function test_authenticated_users_cannot_create_home_info_card_without_image()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->from(route('dashboard.inicio'))
            ->post(route('dashboard.inicio.info-cards.store'), [
                'title' => 'Tarjeta sin imagen',
                'description' => 'Descripcion sin imagen',
            ])
            ->assertRedirect(route('dashboard.inicio'))
            ->assertSessionHasErrors('image');

        $this->assertDatabaseEmpty('home_info_cards');
    }

    public function test_authenticated_users_can_manage_home_info_list_items()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('dashboard.inicio.list-items.store'), [
            'title' => 'Atencion personalizada',
            'description' => 'Nuestro equipo esta disponible para ti.',
            'image' => UploadedFile::fake()->image('list-item.jpg'),
        ])->assertRedirect(route('dashboard.inicio'));

        $item = HomeInfoListItem::query()->first();

        $this->assertNotNull($item);
        $this->assertSame('Atencion personalizada', $item->title);
        $this->assertTrue(Storage::disk('public')->exists($item->image_path));

        $this->put(route('dashboard.inicio.list-items.update', $item), [
            'title' => 'Espacios comodos',
            'description' => 'Disenados para tu descanso.',
        ])->assertRedirect(route('dashboard.inicio'));

        $item->refresh();

        $this->assertSame('Espacios comodos', $item->title);
        $this->assertNotNull($item->image_path);

        $this->delete(route('dashboard.inicio.list-items.destroy', $item))
            ->assertRedirect(route('dashboard.inicio'));

        $this->assertDatabaseEmpty('home_info_list_items');
        $this->assertFalse(Storage::disk('public')->exists($item->image_path));
    }

    public function test_authenticated_users_cannot_create_home_info_list_item_without_image()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->from(route('dashboard.inicio'))
            ->post(route('dashboard.inicio.list-items.store'), [
                'title' => 'Elemento sin imagen',
                'description' => 'Descripcion sin imagen',
            ])
            ->assertRedirect(route('dashboard.inicio'))
            ->assertSessionHasErrors('image');

        $this->assertDatabaseEmpty('home_info_list_items');
    }

    public function test_authenticated_users_can_manage_home_faqs()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $this->post(route('dashboard.inicio.faqs.store'), [
            'question' => 'Cual es el horario?',
            'answer' => 'Atendemos todos los dias de 9:00 a 21:00 h.',
        ])->assertRedirect(route('dashboard.inicio'));

        $faq = HomeFaq::query()->first();

        $this->assertNotNull($faq);
        $this->assertSame('Cual es el horario?', $faq->question);

        $this->put(route('dashboard.inicio.faqs.update', $faq), [
            'question' => 'Aceptan mascotas?',
            'answer' => 'Si, en habitaciones seleccionadas.',
        ])->assertRedirect(route('dashboard.inicio'));

        $faq->refresh();

        $this->assertSame('Aceptan mascotas?', $faq->question);

        $this->delete(route('dashboard.inicio.faqs.destroy', $faq))
            ->assertRedirect(route('dashboard.inicio'));

        $this->assertDatabaseEmpty('home_faqs');
    }
}
