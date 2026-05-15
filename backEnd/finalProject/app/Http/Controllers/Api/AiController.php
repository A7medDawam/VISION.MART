<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AiController extends Controller
{
    public function searchByImage(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|image',
            ]);

            $file = $request->file('file');

            $response = Http::timeout(120)
                ->attach(
                    'file',
                    file_get_contents($file->getRealPath()),
                    $file->getClientOriginalName()
                )
                ->post('http://127.0.0.1:8001/search-by-image');

            if (!$response->successful()) {
                return response()->json([
                    'status' => false,
                    'message' => 'AI service failed',
                    'ai_response' => $response->body(),
                ], 500);
            }

            $aiData = $response->json();

            $results = collect($aiData['results'] ?? [])->map(function ($item) {
                $productId =
                    $item['id'] ??
                    $item['product_id'] ??
                    null;

                if (!$productId) {
                    return null;
                }

                $product = Product::with('category')->find($productId);

                if (!$product) {
                    return null;
                }

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'image' => $product->image,
                    'category_id' => $product->category_id,
                    'category_name' => $product->category?->name,
                    'category' => $product->category ? [
                        'id' => $product->category->id,
                        'name' => $product->category->name,
                    ] : null,
                    'similarity' => $item['similarity'] ?? $item['score'] ?? null,
                ];
            })->filter()->values();

            return response()->json([
                'status' => true,
                'predicted_category' => $aiData['predicted_category'] ?? null,
                'confidence' => $aiData['confidence'] ?? null,
                'results' => $results,
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ], 500);
        }
    }
}