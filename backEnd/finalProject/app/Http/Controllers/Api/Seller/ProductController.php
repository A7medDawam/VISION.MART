<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    private function ensureSeller($user)
    {
        if (!$user || $user->role !== 'seller') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Seller only.'
            ], 403);
        }

        return null;
    }

    public function index(Request $request)
    {
        if ($response = $this->ensureSeller($request->user())) {
            return $response;
        }

        $products = Product::with('category')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Seller products fetched successfully',
            'data' => $products,
        ]);
    }

    public function show(Request $request, $id)
    {
        if ($response = $this->ensureSeller($request->user())) {
            return $response;
        }

        $product = Product::with('category')
            ->where('user_id', $request->user()->id)
            ->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Product fetched successfully',
            'data' => $product,
        ]);
    }

    public function store(Request $request)
    {
        if ($response = $this->ensureSeller($request->user())) {
            return $response;
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'category_id' => 'required|exists:categories,id',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('products', 'public');
        }

        $product = Product::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'category_id' => $validated['category_id'],
            'image' => $imagePath,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Product created successfully',
            'data' => $product,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        if ($response = $this->ensureSeller($request->user())) {
            return $response;
        }

        $product = Product::where('user_id', $request->user()->id)->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'quantity' => 'sometimes|required|integer|min:1',
            'category_id' => 'sometimes|required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }

            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Product updated successfully',
            'data' => $product,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if ($response = $this->ensureSeller($request->user())) {
            return $response;
        }

        $product = Product::where('user_id', $request->user()->id)->find($id);

        if (!$product) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        }

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'status' => true,
            'message' => 'Product deleted successfully',
        ]);
    }

    public function dashboardStats(Request $request)
    {
    if ($response = $this->ensureSeller($request->user())) {
        return $response;
    }

    $sellerId = $request->user()->id;

    $myProducts = Product::where('user_id', $sellerId)->count();


    $orderedProducts = \App\Models\OrderItems::whereHas('product', function ($q) use ($sellerId) {
            $q->where('user_id', $sellerId);
        })
        ->distinct('product_id')
        ->count('product_id');

    $totalSales = \App\Models\OrderItems::whereHas('product', function ($q) use ($sellerId) {
            $q->where('user_id', $sellerId);
        })
        ->sum('price');
    $productsInStock = Product::where('user_id', $sellerId)->sum('quantity');
    return response()->json([
        'status' => true,
        'data' => [
            'my_products' => $myProducts,
            'ordered_products' => $orderedProducts,
            'total_sales' => $totalSales,
            'products_in_stock' => $productsInStock, 
        ],
       ]);
    }
}