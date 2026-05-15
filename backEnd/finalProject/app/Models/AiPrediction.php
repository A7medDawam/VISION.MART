<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiPrediction extends Model
{
    protected $fillable = [
        'product_id',
        'predicted_category_id',
        'confidence',
        'suggested_name',
        'suggested_tags',
        'suggested_attributes',
        'status'
    ];

    protected $casts = [
        'suggested_attributes' => 'array',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'predicted_category_id');
    }
}