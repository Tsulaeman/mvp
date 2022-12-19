<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'username' => $this->faker->unique()->safeEmail,
            'password' => Hash::make("abcd1234"),
            'role' => $this->faker->randomElement([
                User::BUYER,
                User::SELLER
            ]),
            'deposit' => 0
        ];
    }

    /**
     * Create a buyer
     *
     * @return array
     */
    public function buyer()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => User::BUYER,
            ];
        });
    }

    /**
     * Create a seller
     *
     * @return array
     */
    public function seller()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => User::SELLER,
            ];
        });
    }
}
