<?php

namespace Tests\Feature;

use App\Models\HomeCarouselImage;
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
        Storage::disk('public')->assertExists($image->image_path);

        $this->delete(route('dashboard.inicio.carousel.destroy', $image))
            ->assertRedirect(route('dashboard.inicio'));

        $this->assertDatabaseEmpty('home_carousel_images');
        Storage::disk('public')->assertMissing($image->image_path);
    }
}
