<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('predicted_category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->nullOnDelete();

            $table->float('confidence')->nullable();

            $table->string('suggested_name')->nullable();

            $table->text('suggested_tags')->nullable();

            $table->json('suggested_attributes')->nullable();

            $table->enum('status', ['pending', 'accepted', 'edited', 'rejected'])
                  ->default('pending');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_predictions');
    }
};