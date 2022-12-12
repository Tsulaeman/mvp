<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /**
     * The amount of the product available
     *
     * @var int
     */
    public $amountAvailable;

    /**
     * The cost of the product
     *
     * @var int
     */
    public $cost;

    /**
     * The name of the product
     *
     * @var string
     */
    public $productName;

    /**
     * The name of the product
     *
     * @var int
     */
    public $sellerId;

    protected $fillable = [
        "amountAvailable",
        "cost",
        "productName"
    ];

    public function seller()
    {
        return $this->belongsTo("App\User", "sellerId", "id");
    }

    public function buyers()
    {
        return $this->belongsToMany("App\User", "buyer_product", "productId", "buyerId");
    }
}
