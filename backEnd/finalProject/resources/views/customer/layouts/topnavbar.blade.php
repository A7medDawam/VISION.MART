<div class="container-fluid px-5 py-4 d-none d-lg-block">
  <div class="row gx-0 align-items-center text-center">
      <div class="col-md-4 col-lg-3 text-center text-lg-start">
          <div class="d-inline-flex align-items-center">
            @auth
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button class="btn btn-danger">Logout</button>
            </form>
   
        @endauth
          </div>
      </div>
      <div class="col-md-4 col-lg-6 text-center">
        <div class="position-relative ps-4">
            <form action="{{ route('customer.userHome') }}" method="GET">
                <div class="row g-2 align-items-center">
    
                    {{-- Category --}}
                    <div class="col-md-4">
                        <div class="dropdown w-100">
                            <button class="btn border rounded-pill w-100 py-3 px-4 dropdown-toggle d-flex align-items-center justify-content-between"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    style="background: #fff;">
                                <span class="d-flex align-items-center">
                                    <span class="text-dark">
                                        {{ request('category') ? ($categories->firstWhere('id', request('category'))->name ?? 'Category') : 'Category' }}
                                    </span>
                                </span>
                            </button>
    
                            <ul class="dropdown-menu shadow rounded-3 p-2 w-100" style="max-height: 300px; overflow-y: auto;">
                                <li>
                                    <a class="dropdown-item rounded-pill"
                                       href="{{ route('customer.userHome', ['q' => request('q')]) }}">
                                        All Categories
                                    </a>
                                </li>
    
                                @foreach ($categories as $category)
                                    <li>
                                        <a class="dropdown-item rounded-pill"
                                           href="{{ route('customer.userHome', [
                                                'q' => request('q'),
                                                'category' => $category->id
                                           ]) }}">
                                            {{ $category->name }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    </div>
    
                    {{-- Search Bar --}}
                    <div class="col-md-8">
                        <div class="d-flex border rounded-pill overflow-hidden">
                            <input
                                class="form-control border-0 rounded-0 py-3"
                                type="text"
                                name="q"
                                value="{{ request('q') }}"
                                placeholder="Search Looking For?"
                            >
    
                            {{-- Camera --}}
                            <input type="file" id="aiImageSearchInput" accept="image/*" style="display:none;">
                            <button type="button" class="btn btn-light border-0 px-4" id="aiSearchBtn" title="AI Image Search">
                                <i class="fas fa-camera text-dark"></i>
                            </button>
                            {{-- Search --}}
                            <button type="submit" class="btn btn-primary rounded-0 py-3 px-5" style="border:0;">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
    
                </div>
            </form>
        </div>
    </div>
      <div class="col-md-4 col-lg-3 text-center text-lg-end">
          <div class="d-inline-flex align-items-center">
            @auth
                <a href="{{ route('customer.orders') }}" class="btn btn-outline-primary rounded-pill me-4">
                    My Orders
                </a>
        
                <a href="{{ route('customer.wishlist') }}" class="text-muted d-flex align-items-center justify-content-center me-3">
                    <span class="rounded-circle btn-md-square border">
                        <i class="fas fa-heart"></i>
                    </span>
                </a>
            @else
                <a href="{{ route('login') }}" class="btn btn-outline-primary rounded-pill me-4">
                    Login
                </a>
        
                <a href="{{ route('login') }}" class="text-muted d-flex align-items-center justify-content-center me-3">
                    <span class="rounded-circle btn-md-square border">
                        <i class="fas fa-heart"></i>
                    </span>
                </a>
            @endauth
            <a href="#" class="text-muted d-flex align-items-center justify-content-center" id="cartBtn">
                <span class="rounded-circle btn-md-square border">
                    <i class="fas fa-shopping-cart"></i>
                </span>
                <span class="text-dark ms-2">${{ $total ?? 0 }}</span>
            </a>
          </div>
      </div>
  </div>
</div>