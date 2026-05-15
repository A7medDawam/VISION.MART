<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class ProfileController extends Controller
{

    public function update(Request $request)

   {
    $user = Auth::user();

    $validator = Validator::make($request->all(), [
        'name' => ['required', 'string', 'max:255'],
        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('users', 'email')->ignore($user->id),
        ],
        'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],

        'current_password' => ['nullable', 'required_with:password'],
        'password' => ['nullable', 'string', 'min:8', 'confirmed'],
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => $validator->errors()->first(),
            'errors' => $validator->errors(),
        ], 422);
    }

    if ($request->filled('password')) {

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => false,
                'message' => 'Old password is incorrect'
            ], 422);
        }

        $user->password = Hash::make($request->password);
    }

    $user->name = $request->name;
    $user->email = $request->email;

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('users', 'public');
        $user->image = $path;
    }

    $user->save();

    return response()->json([
        'status' => true,
        'message' => 'Profile updated successfully',
        'user' => $user,
    ], 200);
   }
}