<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->middleware(
            "auth:api",
            [
                "except" => ["create"]
            ]
        );
    }

    public function index() {
        return response()->json(
            User::paginate()
        );
    }

    public function get($userId) {
        $user = User::with(["products"])->find($userId);
        return response()->json($user);
    }

    public function create(Request $request)
    {
        $data = $request->all();

        $this->validate(
            $request,
            [
                "username" => "required|string|max:100|unique:users,username",
                "role" => [
                    'required',
                    Rule::in([User::BUYER, User::SELLER])
                ],
                "password" => "required|string"
            ]
        );

        $data["password"] = Hash::make($data["password"]);
        $data["deposit"] = 0;
        $user = new User();
        $user->fill($data);
        $user->forceFill(["password" => $data["password"]]);
        $user->save();

        return response()->json(
            $user
        );
    }

    public function update(Request $request, $userId) {
        $data = $request->all();
        $user = User::findOrFail($userId);
        $this->validate(
            $request,
            [
                "username" => [
                    "required",
                    Rule::unique("users", "id")->ignore($request->user()->id)
                ],
                "deposit" => "required|numeric",
                "role" => [
                    'required',
                    Rule::in([User::BUYER, User::SELLER])
                ]
            ]
        );

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
        $user = auth()->user();
        $data = $request->all();
        $this->validate(
            $request,
            [
                "productId" => "required",
                "amount" => "required|numeric|min:1"
            ]
        );

        $product = Product::findOrFail($data["productId"]);
        $amountPurchased = $data["amount"];
        // Sometimes, the amount to be purchased might be greater than what is available
        $diff = $product->amountAvailable - $data["amount"];
        if($diff < 0) {
            $amountPurchased += $diff;
        }

        $cost = $amountPurchased * $product->cost;

        if($user->deposit < $cost) {
            return response()->json(
                ["message" => "You do not have sufficient deposit"],
                400
            );
        }
        $user->deposit -= $cost;
        $product->amountAvailable -= $amountPurchased;

        $user->products()->attach($product);
        $user->save();

        $product->save();
        $totalSpent = $user->products()->get()->map( function (Product $product) {
            return $product->cost;
        })->toArray();

        return response()->json([
            "totalSpent" => array_sum($totalSpent),
            "products" => $user->products()->get(),
            "change" => $user->deposit
        ]);
    }

    public function deposit(Request $request) {
        $user = $request->user();
        $data = $request->all();
        $this->validate(
            $request,
            [
                "deposit" => [
                    'required',
                    Rule::in([5, 10, 20, 50, 100]),
                    'numeric'
                ],
            ]
        );

        $user->deposit += $data["deposit"];
        $user->save();

        return response()->json(
            $user
        );
    }

    public function reset(Request $request) {
        $user = $request->user();
        $user->deposit = 0;
        $user->save();

        return response()->json(
            $user
        );
    }
}
