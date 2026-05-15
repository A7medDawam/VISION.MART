<div class="offcanvas offcanvas-end" data-bs-scroll="true" tabindex="-1" id="offcanvasCart" aria-labelledby="My Cart" aria-modal="true" role="dialog">
  <div class="offcanvas-header justify-content-center">
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>

  <div class="offcanvas-body">
      <div class="order-md-last">
          <h4 class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-primary">Your cart</span>
              <span class="badge bg-primary rounded-pill">{{ $cart?->items?->count() ?? 0 }}</span>
          </h4>

          <ul class="list-group mb-3">
              @forelse (($cart?->items ?? collect()) as $cartItem)
                  <li class="list-group-item">
                      <div class="d-flex justify-content-between">
                          <div class="w-100">
                              <h6 class="my-0">{{ $cartItem->product->name }}</h6>
                              <small class="text-body-secondary d-block mb-2">
                                  {{ $cartItem->product->description }}
                              </small>

                              <div class="d-flex align-items-center justify-content-between mt-2">
                                  <div class="d-flex align-items-center gap-2">
                                      <form action="{{ route('customer.cart.remove', $cartItem->id) }}" method="POST">
                                          @csrf
                                          @method('DELETE')
                                          <button type="submit" class="btn btn-sm btn-warning rounded-pill px-3">-</button>
                                      </form>

                                      <span class="fw-bold">{{ $cartItem->quantity }}</span>

                                      <form action="{{ route('customer.addCart', $cartItem->product->id) }}" method="POST">
                                          @csrf
                                          <button type="submit" class="btn btn-sm btn-success rounded-pill px-3">+</button>
                                      </form>
                                  </div>

                                  <span class="text-body-secondary fw-bold">
                                      ${{ $cartItem->product->price }}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </li>
              @empty
                  <li class="list-group-item text-center text-muted">
                      Your cart is empty
                  </li>
              @endforelse
          </ul>

          @auth
              @if($cart && $cart->items->count())
                  <form action="{{ route('customer.createOrder') }}" method="post">
                      @csrf
                      <button class="w-100 btn btn-primary btn-lg" type="submit">
                          Continue to Checkout
                      </button>
                  </form>
              @endif
          @else
              <a href="{{ route('login') }}" class="w-100 btn btn-primary btn-lg">
                  Login to checkout
              </a>
          @endauth
      </div>
  </div>
</div>