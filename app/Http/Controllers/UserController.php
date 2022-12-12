<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExampleController extends Controller
{
    /**
     * The user
     *
     * @var User
     */
    public $user;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->user = User::find($request->user()->id);
    }

    public function index() {
        return response()->json(
            User::paginate()
        );
    }

    public function get($userId) {
        $user = User::findOrFail($userId);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        $data = $request->all();

        $request->validate([
            "username" => "required|string|max:100|unique:users,username",
            "deposit" => "required|numeric",
            "role" => [
                'required',
                Rule::in([User::BUYER, User::SELLER])
            ]
        ]);
        $user = new User();
        $user->fill($data);

        $user->save();
        return response()->json(
            $user
        );
    }

    public function update(Request $request, $userId) {
        $data = $request->all();

        $request->validate([
            "username" => [
                "required",
                Rule::unique("users", "username")->ignore($request->user()->username)
            ],
            "deposit" => "required|numeric",
            "role" => [
                'required',
                Rule::in([User::BUYER, User::SELLER])
            ]
        ]);
        $user = new User();
        $user->fill($data);

        $user->save();
        return response()->json(
            $user
        );
    }

    public function destroy($userId) {
        $user = User::findOrFail($userId);
        $user->destroy();

        return response()->json([
            "User deleted"
        ]);
    }

    public function buy(Request $request) {
        $data = $request->all();
        $request->validate([
            "productId" => "required",
            "amount" => "required"
        ], $data);

        $product = Product::findOrFail($data["productId"]);
        $amountPurchased = $data["amount"];
        // Sometimes, the amount to be purchased might be greater than what is available
        $diff = $product->amountAvailable - $data["amount"];
        if($diff < 0) {
            $amountPurchased -= $diff;
        }

        $cost = $amountPurchased * $product->cost;
        $this->user->deposit -= $cost;
        $product->amountAvailable -= $amountPurchased;

        $this->user->save();
        $product->save();

        return response()->json([
            "totalSpent" => "",
            "products" => $this->user->products(),
            "change" => []
        ]);
    }

    public function deposit(Request $request) {
        $data = $request->all();
        $request->validate([
            "deposit" => [
                'required',
                Rule::in([5, 10, 20, 50, 100]),
                'numeric'
            ],
        ], $data);

        $this->user->deposit += $data["deposit"];
        $this->user->save();

        return response()->json(
            $this->user
        );
    }

    public function reset(Request $request) {
        $this->user->deposit = 0;
        $this->user->save();
    }
}
