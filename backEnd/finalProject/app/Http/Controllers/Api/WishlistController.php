<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $wishlist = Wishlist::with(['items.product.category'])
            ->firstOrCreate([
                'user_id' => $request->user()->id
            ]);
    
        return response()->json([
            'status' => true,
            'data' => $wishlist,
        ]);
    }

    public function toggle(Request $request, $productId)
    {
        $wishlist = Wishlist::firstOrCreate([
            'user_id' => $request->user()->id
        ]);

        $item = $wishlist->items()->where('product_id', $productId)->first();

        if ($item) {
            $item->delete();

            return response()->json([
                'status' => true,
                'message' => 'Product removed from wishlist',
            ]);
        }

        $wishlist->items()->create([
            'product_id' => $productId,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Product added to wishlist',
        ]);
    }

    public function destroy(Request $request, $itemId)
    {
        $wishlist = Wishlist::where('user_id', $request->user()->id)->first();

        if (!$wishlist) {
            return response()->json([
                'status' => false,
                'message' => 'Wishlist not found',
            ], 404);
        }

        $item = $wishlist->items()->find($itemId);

        if (!$item) {
            return response()->json([
                'status' => false,
                'message' => 'Wishlist item not found',
            ], 404);
        }

        $item->delete();

        return response()->json([
            'status' => true,
            'message' => 'Item removed from wishlist successfully',
        ]);
    }
}