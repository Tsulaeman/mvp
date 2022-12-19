<?php

use App\Models\Product;
use App\Models\User;
use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Testing\DatabaseTransactions;

class BuyerTest extends TestCase
{
    /**
     * The buyer
     *
     * @var User
     */
    public $user;

    /**
     * The user's access token
     *
     * @var string
     */
    public $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->buyer()->create();
        $response = $this->json("POST", "auth/login", [
                "username" => $this->user->username,
                "password" => "abcd1234"
            ]
        );
        // $response = json_decode($response->getContent());
        $data = $response->response->json();
        $this->token = $data["access_token"];
    }
    /**
     * A basic test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->get('/');

        $this->assertEquals(
            $this->app->version(), $this->response->getContent()
        );
    }

    public function testDeposit()
    {
        $totalDeposit = $this->user->deposit;
        $response = $this->patch(
            "buyers/deposit",
            ["deposit" => 100],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $data = $response->response->json();

        $this->assertEquals($data["deposit"], 100 + $totalDeposit);
    }

    public function testDepositFailure()
    {
        $totalDeposit = $this->user->deposit;
        $response = $this->patch(
            "buyers/deposit",
            ["deposit" => 30],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $this->assertResponseStatus(422);
    }

    public function testBuySuccess()
    {
        // Create a product
        $product = Product::factory([
            "cost" => 50,
            "amountAvailable" => 5
        ])->create();
        // Deposit
        $totalDeposit = $this->user->deposit;
        $response = $this->patch(
            "buyers/deposit",
            ["deposit" => 100],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $data = $response->response->json();
        $this->assertEquals($data["deposit"], 100 + $totalDeposit);

        // Buy
        $amount = 1;
        $buyResponse = $this->json(
            "POST",
            "buyers/buy",
            [
                "productId" => $product->id,
                "amount" => $amount
            ],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $buyResponse->assertResponseOk();

        // $buyData = $buyResponse->response->json();
        $updatedProduct = Product::find($product->id);
        $this->assertEquals($updatedProduct->amountAvailable, $product->amountAvailable - $amount);
    }

    public function testBuyFailureLowDeposit()
    {
        // Create a product
        $product = Product::factory([
            "cost" => 100,
            "amountAvailable" => 1
        ])->create();
        // Deposit
        $totalDeposit = $this->user->deposit;
        $response = $this->patch(
            "buyers/deposit",
            ["deposit" => 50],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $data = $response->response->json();
        $this->assertEquals($data["deposit"], 50 + $totalDeposit);

        // Buy
        $amount = 1;
        $buyResponse = $this->json(
            "POST",
            "buyers/buy",
            [
                "productId" => $product->id,
                "amount" => $amount
            ],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $buyResponse->assertResponseStatus(422);
    }

    public function testBuyFailureLowAmountAvailable()
    {
        // Create a product
        $product = Product::factory([
            "cost" => 50,
            "amountAvailable" => 5
        ])->create();
        // Deposit
        $totalDeposit = $this->user->deposit;
        $response = $this->patch(
            "buyers/deposit",
            ["deposit" => 100],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $data = $response->response->json();
        $this->assertEquals($data["deposit"], 100 + $totalDeposit);

        // Buy
        $amount = 5;
        $buyResponse = $this->json(
            "POST",
            "buyers/buy",
            [
                "productId" => $product->id,
                "amount" => $amount
            ],
            ["Authorization" => "Bearer {$this->token}"]
        );

        $buyResponse->assertResponseStatus(422);
    }
}