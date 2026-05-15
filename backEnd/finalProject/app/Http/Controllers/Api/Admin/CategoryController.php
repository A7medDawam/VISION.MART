<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    private function ensureAdmin($user)
    {
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized. Admin only.'
            ], 403);
        }

        return null;
    }

    public function index(Request $request)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $categories = Category::latest()->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Categories fetched successfully',
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'status' => 'required|boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Category created successfully',
            'data' => $category,
        ], 201);
    }

    public function show(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'message' => 'Category fetched successfully',
            'data' => $category,
        ]);
    }

    public function update(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255|unique:categories,name,' . $id,
            'status' => 'sometimes|required|boolean',
        ]);

        $category->update($validated);

        return response()->json([
            'status' => true,
            'message' => 'Category updated successfully',
            'data' => $category,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'status' => false,
                'message' => 'Category not found',
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => true,
            'message' => 'Category deleted successfully',
        ]);
    }
}