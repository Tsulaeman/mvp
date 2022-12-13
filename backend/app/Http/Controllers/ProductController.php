<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware("auth:api", ["except" => ["index", "get"] ]);
        $this->middleware("seller", ["except" => ["index", "get", "buy"] ]);
    }

    public function index() {
        return response()->json(
            Product::paginate()
        );
    }

    public function get($productId) {
        $products = Product::findOrFail($productId);
        return response()->json(
            $products
        );
    }

    public function create(Request $request) {
        $data = $request->all();
        $this->validate(
            $request,
            [
                "productName" => "required|string|max:100",
                "cost" => "required|numeric",
                "amountAvailable" => "required|numeric"
            ]
        );

        $product = new Product();
        $product->fill($data);
        $product->seller()->associate(auth()->user());

        $product->save();
        return response()->json(
            $product
        );
    }
    public function update(Request $request, $productId) {
        $data = $request->all();
        $product = Product::findOrFail($productId);
        $this->validate(
            $request,
            [
                "productName" => "required|string|max:100",
                "cost" => "required|numeric",
                "amountAvailable" => "required|numeric"
            ]
        );

        $product->fill($data);

        $product->save();
        return response()->json(
            $product
        );
    }

    public function destroy($productId) {
        $product = Product::findOrFail($productId);
        $product->destroy();

        return response()->json([
            "Product deleted"
        ]);

    }
}
