<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::with('items.product')
            ->firstOrCreate(['user_id' => $request->user()->id]);
    
        $total = $cart->items->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });
    
        return response()->json([
            'status' => true,
            'data' => $cart,
            'total' => $total,
        ]);
    }

    public function store(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'nullable|integer|min:1',
        ]);
    
        $quantity = (int) $request->input('quantity', 1);
    
        $product = Product::find($productId);
    
        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }
    
        $cart = Cart::firstOrCreate([
            'user_id' => $request->user()->id
        ]);
    
        $item = $cart->items()->where('product_id', $product->id)->first();
    
        if ($item) {
            $newQty = $item->quantity + $quantity;
    
            $item->update([
                'quantity' => $newQty,
                'price' => $product->price * $newQty,
            ]);
        } else {
            $cart->items()->create([
                'product_id' => $product->id,
                'quantity' => $quantity,
                'price' => $product->price * $quantity,
            ]);
        }
    
        return response()->json([
            'status' => true,
            'message' => 'Product added to cart successfully',
        ]);
    }

    public function update(Request $request, $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            return response()->json([
                'status' => false,
                'message' => 'Cart not found',
            ], 404);
        }

        $item = $cart->items()->with('product')->find($itemId);

        if (!$item) {
            return response()->json([
                'status' => false,
                'message' => 'Item not found',
            ], 404);
        }

        $item->update([
            'quantity' => $request->quantity,
            'price' => $item->product->price * $request->quantity,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Cart item updated successfully',
        ]);
    }

    public function destroy(Request $request, $itemId)
    {
        $cart = Cart::where('user_id', $request->user()->id)->first();

        if (!$cart) {
            return response()->json([
                'status' => false,
                'message' => 'Cart not found',
            ], 404);
        }

        $item = $cart->items()->find($itemId);

        if (!$item) {
            return response()->json([
                'status' => false,
                'message' => 'Item not found',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from cart successfully',
        ]);
    }
}