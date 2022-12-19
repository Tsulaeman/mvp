<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        "amountAvailable",
        "cost",
        "productName"
    ];

    public function seller()
    {
        return $this->belongsTo(User::class, "sellerId", "id");
    }

    public function buyers()
    {
        return $this->belongsToMany(User::class, "buyer_product", "productId", "buyerId");
    }
}
