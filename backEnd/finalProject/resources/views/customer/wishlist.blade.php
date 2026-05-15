@extends('customer.main')

@section('body')

<div class="container py-5">
    <h2 class="mb-4">My Wishlist</h2>

    @if ($wishlist && $wishlist->items->count() > 0)
        <div class="row g-4">
            @foreach ($wishlist->items as $item)
                <div class="col-md-6 col-lg-4 col-xl-3">
                    <div class="product-item rounded">
                        <div class="product-item-inner border rounded">
                            <div class="product-item-inner-item">
                                <div class="product-image-box text-center p-3">
                                    <img src="{{ asset('storage/' . $item->product->image) }}"
                                         class="img-fluid"
                                         alt="{{ $item->product->name }}">
                                </div>
                            </div>

                            <div class="text-center rounded-bottom p-4">
                                <h5>{{ $item->product->name }}</h5>
                                <p>{{ $item->product->description }}</p>
                                <span class="text-primary fs-5">${{ $item->product->price }}</span>
                            </div>
                        </div>

                        <div class="border border-top-0 rounded-bottom text-center p-4 pt-0">
                            <form action="{{ route('customer.addCart', $item->product->id) }}" method="POST" class="mb-2">
                                @csrf
                                <button type="submit" class="btn btn-primary rounded-pill px-4">
                                    <i class="fas fa-shopping-cart me-2"></i> Add To Cart
                                </button>
                            </form>

                            <form action="{{ route('customer.wishlist.remove', $item->id) }}" method="POST">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger rounded-pill px-4">
                                    Remove
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="alert alert-info">
            Your wishlist is empty.
        </div>
    @endif
</div>

@endsection