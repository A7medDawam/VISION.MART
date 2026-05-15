@extends('customer.main')

@section('body')

<div class="container py-5">
    <h2 class="mb-4">My Orders / Order History</h2>

    @if ($orders->count() > 0)
        @foreach ($orders as $order)
            <div class="card mb-4 shadow-sm">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <div>
                        <strong>Order #{{ $order->id }}</strong>
                    </div>
                    <div>
                        @php
                            $color = match($order->status) {
                                'pending' => 'warning',
                                'completed' => 'success',
                                'cancelled' => 'danger',
                                default => 'secondary'
                            };
                        @endphp

                        <span class="badge bg-{{ $color }}">
                            {{ ucfirst($order->status) }}
                        </span>

                        <form action="{{ route('customer.orders.toggleStatus', $order->id) }}" method="POST" class="mt-2">
                            @csrf

                            @if($order->status == 'cancelled')
                                <button class="btn btn-success btn-sm">
                                    Activate Order
                                </button>
                            @else
                                <button class="btn btn-danger btn-sm">
                                    Cancel Order
                                </button>
                            @endif
                        </form>
                    </div>
                    
                </div>

                <div class="card-body">
                    <p class="mb-2"><strong>Date:</strong> {{ $order->created_at->format('Y-m-d h:i A') }}</p>
                    <p class="mb-3"><strong>Total:</strong> ${{ $order->total }}</p>

                    <div class="table-responsive">
                        <table class="table table-bordered align-middle">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Image</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($order->items as $item)
                                    <tr>
                                        <td>{{ $item->product->name }}</td>
                                        <td>
                                            <img src="{{ asset('storage/' . $item->product->image) }}"
                                                 alt="{{ $item->product->name }}"
                                                 width="70">
                                        </td>
                                        <td>{{ $item->quantity }}</td>
                                        <td>${{ $item->price }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        @endforeach

        <div class="mt-4">
            {{ $orders->links() }}
        </div>
    @else
        <div class="alert alert-info">
            You do not have any orders yet.
        </div>
    @endif
</div>

@include('customer.cart')

@endsection