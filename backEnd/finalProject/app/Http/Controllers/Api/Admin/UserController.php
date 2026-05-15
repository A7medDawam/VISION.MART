<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
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

    public function sellers(Request $request)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $sellers = User::where('role', 'seller')
            ->withCount('products')
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Sellers fetched successfully',
            'data' => $sellers,
        ]);
    }

    public function toggleSellerStatus(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $seller = User::where('role', 'seller')->find($id);

        if (!$seller) {
            return response()->json([
                'status' => false,
                'message' => 'Seller not found',
            ], 404);
        }

        $seller->status = !$seller->status;
        $seller->save();

        return response()->json([
            'status' => true,
            'message' => 'Seller status updated successfully',
            'data' => $seller,
        ]);
    }

    public function deleteSeller(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $seller = User::where('role', 'seller')->find($id);

        if (!$seller) {
            return response()->json([
                'status' => false,
                'message' => 'Seller not found',
            ], 404);
        }

        $seller->delete();

        return response()->json([
            'status' => true,
            'message' => 'Seller deleted successfully',
        ]);
    }

    public function customers(Request $request)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $customers = User::where('role', 'customer')
            ->withCount('orders')
            ->latest()
            ->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Customers fetched successfully',
            'data' => $customers,
        ]);
    }

    public function toggleCustomerStatus(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $customer = User::where('role', 'customer')->find($id);

        if (!$customer) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        $customer->status = !$customer->status;
        $customer->save();

        return response()->json([
            'status' => true,
            'message' => 'Customer status updated successfully',
            'data' => $customer,
        ]);
    }

    public function deleteCustomer(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request->user())) {
            return $response;
        }

        $customer = User::where('role', 'customer')->find($id);

        if (!$customer) {
            return response()->json([
                'status' => false,
                'message' => 'Customer not found',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'status' => true,
            'message' => 'Customer deleted successfully',
        ]);
    }
}