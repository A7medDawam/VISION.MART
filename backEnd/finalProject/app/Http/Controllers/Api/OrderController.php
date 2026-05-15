<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'data' => $orders,
        ]);
    }

    public function store(Request $request)
    {
        $cart = Cart::with('items.product')
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart || $cart->items->count() == 0) {
            return response()->json([
                'status' => false,
                'message' => 'Your cart is empty',
            ], 400);
        }

        DB::beginTransaction();

        try {
            $total = $cart->items->sum('price');

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total' => $total,
                'status' => 'completed',
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([
                    'product_id' => $item->product->id,
                    'price' => $item->price,
                    'quantity' => $item->quantity,
                ]);
            }

            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Order placed successfully',
                'data' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function toggleStatus(Request $request, $id)
    {
        $order = Order::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Order not found',
            ], 404);
        }

        $order->status = $order->status === 'cancelled' ? 'completed' : 'cancelled';
        $order->save();

        return response()->json([
            'status' => true,
            'message' => 'Order status updated successfully',
            'data' => $order,
        ]);
    }
}