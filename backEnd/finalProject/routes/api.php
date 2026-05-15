<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\Seller\ProductController as SellerProductController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;

//////////////////////////// Public APIs //////////////////////////


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

Route::get('/categories', [CategoryController::class, 'index']);

Route::post('/ai/search', [AiController::class, 'searchByImage']);

///////////////////  Authenticated APIs  //////////////////////////

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Profile APIs
    Route::post('/profile/update', [ProfileController::class, 'update']);
});

//////////////////////////// Admin APIs //////////////////////////

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('products', AdminProductController::class);

    Route::get('/sellers', [AdminUserController::class, 'sellers']);
    Route::put('/sellers/{id}/toggle-status', [AdminUserController::class, 'toggleSellerStatus']);
    Route::delete('/sellers/{id}', [AdminUserController::class, 'deleteSeller']);

    Route::get('/customers', [AdminUserController::class, 'customers']);
    Route::put('/customers/{id}/toggle-status', [AdminUserController::class, 'toggleCustomerStatus']);
    Route::delete('/customers/{id}', [AdminUserController::class, 'deleteCustomer']);
});


//////////////////////////// Seller APIs //////////////////////////


Route::middleware(['auth:sanctum', 'role:seller'])->prefix('seller')->group(function () {
    Route::get('/products', [SellerProductController::class, 'index']);
    Route::post('/products', [SellerProductController::class, 'store']);
    Route::get('/products/{id}', [SellerProductController::class, 'show']);
    Route::put('/products/{id}', [SellerProductController::class, 'update']);
    Route::delete('/products/{id}', [SellerProductController::class, 'destroy']);
    Route::get('/dashboard-stats', [SellerProductController::class, 'dashboardStats']);
});

//////////////////////////// Customer APIs //////////////////////////


Route::middleware(['auth:sanctum', 'role:customer'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/{productId}', [CartController::class, 'store']);
    Route::put('/cart/item/{itemId}', [CartController::class, 'update']);
    Route::delete('/cart/item/{itemId}', [CartController::class, 'destroy']);

    Route::get('/wishlist', [WishlistController::class, 'index']);
    Route::post('/wishlist/{productId}', [WishlistController::class, 'toggle']);
    Route::delete('/wishlist/item/{itemId}', [WishlistController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::put('/orders/{id}/toggle-status', [OrderController::class, 'toggleStatus']);
});