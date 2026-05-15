<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SellerSeeder extends Seeder
{
    public function run(): void
    {
        for ($i = 1; $i <= 400; $i++) {
            $passwordNumber = '12345678';

            User::create([
                'name' => 'Seller ' . $i,
                'email' => 'seller' . $i . '@test.com',
                'password' => Hash::make((string) $passwordNumber),
                'role' => 'seller',
            ]);
        }
    }
}