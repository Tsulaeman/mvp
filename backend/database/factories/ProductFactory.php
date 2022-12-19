<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    public function definition()
    {
        return [
            "amountAvailable" => $this->faker->numberBetween(10, 100),
            "cost" => $this->faker->numberBetween(10, 1000),
            "productName" => $this->faker->sentence(3),
            "sellerId" => User::factory()->create()->id
        ];
    }
}