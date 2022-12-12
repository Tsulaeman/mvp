<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Lumen\Auth\Authorizable;

class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    const BUYER = 1;
    const SELLER = 2;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username', 'deposit', 'role'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The amount the user has in their vending machine account.
     *
     * @var integer
     */
    public $deposit;

    /**
     * The users unique identifier.
     *
     * @var string
     */
    public $username;

    /**
     * The role of this user, either buyer or seller.
     *
     * @var integer
     */
    public $role;

    public function products()
    {
        if ($this->roleId === User::BUYER) {
            return $this->belongsToMany("App\Product", "buyer_product", "buyerId", "productId");
        }

        return $this->hasMany("App\Product", "sellerId");
    }
}
