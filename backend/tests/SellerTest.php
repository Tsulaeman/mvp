<?php

use App\Models\User;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class SellerTest extends TestCase
{


    public function testCreateProduct()
    {
        $seller = User::factory()->seller()->create();

        $login = $this->json(
            "POST",
            "auth/login",
            [
                "username" => $seller->username,
                "password" => "abcd1234"
            ]
        );

        $login->assertResponseOk();
        $response = $login->response->json();

        $product = [
            "productName" => "Coca cola",
            "cost" => 100,
            "amountAvailable" => 5
        ];

        $this->post("products/create", $product, ["Authorization" => "Bearer {$response['access_token']}"]);
        $this->assertResponseOk();
    }
}