<?php

namespace App\Http\Middleware;

use App\Models\Product;
use Closure;

class Seller
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(!auth()->user()) {
            return $next($request);
        }

        $product = Product::find($request->productId);

        if(!auth()->user()->isSeller()) {
            return response()->json(
                ["message" => "Permission denied"],
                403
            );
        }

        if($product && auth()->user()->id !== $product->sellerId) {
            return response()->json(
                ["message" => "Permission denied"],
                403
            );
        }

        return $next($request);
    }
}
