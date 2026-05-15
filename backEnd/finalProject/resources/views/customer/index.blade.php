@extends('customer.main')

@section('body')

<div id="products-wrapper" class="container-fluid product py-5">
    <div class="container py-5">

        {{-- AI Search Results Section --}}
        <div id="ai-search-results" style="display:none;">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 class="mb-1">AI Search Results</h1>
                    <p class="text-muted mb-0" id="ai-search-meta"></p>
                </div>
                <button type="button" class="btn btn-outline-secondary rounded-pill" id="clearAiSearchBtn">
                    Clear AI Search
                </button>
            </div>

            <div class="mb-4 text-center">
                <img id="ai-preview-image" src="" alt="Selected image preview"
                     style="max-width: 220px; max-height: 220px; display:none; border-radius: 12px; border:1px solid #ddd; padding:8px; background:#fff;">
            </div>

            <div id="ai-search-loading" class="text-center mb-4" style="display:none;">
                <h5>⏳ AI is analyzing your image and finding similar products...</h5>
            </div>

            <div id="ai-search-grid" class="row g-4"></div>
        </div>

        {{-- Normal Products Section --}}
        <div id="normal-products-section">
            <div class="tab-class">
                <div class="row g-4">
                    <div class="col-lg-4 text-start wow fadeInLeft" data-wow-delay="0.1s">
                        <h1>Our Products</h1>
                    </div>
                    <div class="col-lg-8 text-end wow fadeInRight" data-wow-delay="0.1s">
                        <ul class="nav nav-pills d-inline-flex text-center mb-5">
                            <li class="nav-item mb-4">
                                <a class="d-flex mx-2 py-2 bg-light rounded-pill active" data-bs-toggle="pill" href="#tab-1">
                                    <span class="text-dark" style="width: 130px;">All Products</span>
                                </a>
                            </li>
                            <li class="nav-item mb-4">
                                <a class="d-flex py-2 mx-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-2">
                                    <span class="text-dark" style="width: 130px;">New Arrivals</span>
                                </a>
                            </li>
                            <li class="nav-item mb-4">
                                <a class="d-flex mx-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-3">
                                    <span class="text-dark" style="width: 130px;">Featured</span>
                                </a>
                            </li>
                            <li class="nav-item mb-4">
                                <a class="d-flex mx-2 py-2 bg-light rounded-pill" data-bs-toggle="pill" href="#tab-4">
                                    <span class="text-dark" style="width: 130px;">Top Selling</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="tab-content">
                    {{-- All Products --}}
                    <div id="tab-1" class="tab-pane fade show p-0 active">
                        <div class="row g-4">
                            @if($products->count() == 0)
                                <div class="col-12 text-center">
                                    <h4>No products found.</h4>
                                </div>
                            @endif

                            @foreach ($products as $product)
                            <div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="product-item rounded wow fadeInUp" data-wow-delay="0.1s">
                                    <div class="product-item-inner border rounded">
                                        <div class="product-item-inner-item">
                                            <div class="product-image-box">
                                                <img src="{{ asset('storage/' . $product->image) }}" class="product-img" alt="{{ $product->name }}">
                                            </div>
                                            <div class="product-details">
                                                <a href="#"><i class="fa fa-eye fa-1x"></i></a>
                                            </div>
                                        </div>
                                        <div class="text-center rounded-bottom p-4">
                                            <a href="#" class="d-block mb-2">{{ $product->name }}</a>
                                            <a href="#" class="d-block h4">{{ $product->description }}</a>
                                            <span class="text-primary fs-5">${{ $product->price }}</span>
                                        </div>
                                    </div>

                                    <div class="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
                                        <form action="{{ route('customer.addCart',$product->id) }}" method="post">
                                            @csrf
                                            <button type="submit"
                                                class="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4">
                                                <i class="fas fa-shopping-cart me-2"></i> Add To Cart
                                            </button>
                                        </form>

                                        <div class="d-flex justify-content-between align-items-center">
                                            <div class="d-flex">
                                                <i class="fas fa-star text-primary"></i>
                                                <i class="fas fa-star text-primary"></i>
                                                <i class="fas fa-star text-primary"></i>
                                                <i class="fas fa-star text-primary"></i>
                                                <i class="fas fa-star"></i>
                                            </div>
                                            <div class="d-flex">
                                                <a href="#"
                                                   class="text-primary d-flex align-items-center justify-content-center me-3">
                                                    <span class="rounded-circle btn-sm-square border">
                                                        <i class="fas fa-random"></i>
                                                    </span>
                                                </a>

                                                <form action="{{ route('customer.wishlist.toggle', $product->id) }}" method="POST" class="m-0">
                                                    @csrf
                                                    <button type="submit" class="text-primary border-0 bg-transparent d-flex align-items-center justify-content-center me-0">
                                                        <span class="rounded-circle btn-sm-square border">
                                                            <i class="fas fa-heart"></i>
                                                        </span>
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endforeach

                            <div class="d-flex justify-content-center mt-4">
                                {{ $products->links() }}
                            </div>
                        </div>
                    </div>

                    {{-- New Arrivals --}}
                    <div id="tab-2" class="tab-pane fade show p-0">
                        <div class="row g-4">
                            @foreach ($newArrivals as $product)
                            <div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="product-item rounded">
                                    <div class="product-item-inner border rounded">
                                        <div class="product-item-inner-item">
                                            <div class="product-image-box">
                                                <img src="{{ asset('storage/' . $product->image) }}" class="product-img" alt="{{ $product->name }}">
                                            </div>
                                        </div>
                                        <div class="text-center rounded-bottom p-4">
                                            <a href="#" class="d-block mb-2">{{ $product->name }}</a>
                                            <a href="#" class="d-block h4">{{ $product->description }}</a>
                                            <span class="text-primary fs-5">${{ $product->price }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Featured --}}
                    <div id="tab-3" class="tab-pane fade show p-0">
                        <div class="row g-4">
                            @foreach ($featuredProducts as $product)
                            <div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="product-item rounded">
                                    <div class="product-item-inner border rounded">
                                        <div class="product-item-inner-item">
                                            <div class="product-image-box">
                                                <img src="{{ asset('storage/' . $product->image) }}" class="product-img" alt="{{ $product->name }}">
                                            </div>
                                        </div>
                                        <div class="text-center rounded-bottom p-4">
                                            <a href="#" class="d-block mb-2">{{ $product->name }}</a>
                                            <a href="#" class="d-block h4">{{ $product->description }}</a>
                                            <span class="text-primary fs-5">${{ $product->price }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>

                    {{-- Top Selling --}}
                    <div id="tab-4" class="tab-pane fade show p-0">
                        <div class="row g-4">
                            @foreach ($topSellingProducts as $product)
                            <div class="col-md-6 col-lg-4 col-xl-3">
                                <div class="product-item rounded">
                                    <div class="product-item-inner border rounded">
                                        <div class="product-item-inner-item">
                                            <div class="product-image-box">
                                                <img src="{{ asset('storage/' . $product->image) }}" class="product-img" alt="{{ $product->name }}">
                                            </div>
                                        </div>
                                        <div class="text-center rounded-bottom p-4">
                                            <a href="#" class="d-block mb-2">{{ $product->name }}</a>
                                            <a href="#" class="d-block h4">{{ $product->description }}</a>
                                            <span class="text-primary fs-5">${{ $product->price }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            @endforeach
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function () {
    const aiSearchBtn = document.getElementById("aiSearchBtn");
    const aiInput = document.getElementById("aiImageSearchInput");

    const resultsWrapper = document.getElementById("ai-search-results");
    const resultsGrid = document.getElementById("ai-search-grid");
    const resultsMeta = document.getElementById("ai-search-meta");
    const loadingBox = document.getElementById("ai-search-loading");
    const previewImage = document.getElementById("ai-preview-image");
    const clearBtn = document.getElementById("clearAiSearchBtn");

    const normalProductsSection = document.getElementById("normal-products-section");
    const productsWrapper = document.getElementById("products-wrapper");

    if (aiSearchBtn && aiInput) {
        aiSearchBtn.addEventListener("click", function () {
            aiInput.click();
        });

        aiInput.addEventListener("change", async function () {
            const file = this.files[0];
            if (!file) return;

            // preview
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "inline-block";
            };
            reader.readAsDataURL(file);

            // switch sections
            normalProductsSection.style.display = "none";
            resultsWrapper.style.display = "block";
            loadingBox.style.display = "block";
            resultsGrid.innerHTML = "";
            resultsMeta.innerHTML = "";

            // scroll directly to products area (after banner)
            setTimeout(() => {
                productsWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);

            const formData = new FormData();
            formData.append("file", file);

            try {
                const res = await fetch("http://127.0.0.1:8001/search-by-image", {
                    method: "POST",
                    body: formData
                });

                const data = await res.json();
                console.log("AI SEARCH RESPONSE:", data);

                loadingBox.style.display = "none";

                if (!data.results || data.results.length === 0) {
                    resultsMeta.innerHTML = "No similar products found.";
                    resultsGrid.innerHTML = `<div class="col-12 text-center"><h5>No similar products found.</h5></div>`;
                    return;
                }

                const confidence = data.confidence ? (data.confidence * 100).toFixed(2) : "0.00";
                resultsMeta.innerHTML = `
                    Predicted category: <strong>${data.predicted_category}</strong>
                    (${confidence}% confidence)
                `;

                let html = '';

                data.results.forEach(product => {
                    html += `
                        <div class="col-md-6 col-lg-4 col-xl-3">
                            <div class="product-item rounded wow fadeInUp" data-wow-delay="0.1s">
                                <div class="product-item-inner border rounded">
                                    <div class="product-item-inner-item">
                                        <div class="product-image-box">
                                            <img src="/storage/${product.image}" class="product-img" alt="${product.name}">
                                        </div>
                                    </div>
                                    <div class="text-center rounded-bottom p-4">
                                        <a href="#" class="d-block mb-2">${product.name}</a>
                                        <a href="#" class="d-block h4">${product.description ?? ''}</a>
                                        <span class="text-primary fs-5">$${product.price}</span>
                                        <div class="mt-2 text-muted small">
                                            Similarity: ${(product.similarity * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                <div class="product-item-add border border-top-0 rounded-bottom text-center p-4 pt-0">
                                    <form action="/addCart/${product.id}" method="POST">
                                        <button type="submit"
                                            class="btn btn-primary border-secondary rounded-pill py-2 px-4 mb-4">
                                            <i class="fas fa-shopping-cart me-2"></i> Add To Cart
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    `;
                });

                resultsGrid.innerHTML = html;

            } catch (err) {
                console.error(err);
                loadingBox.style.display = "none";
                resultsMeta.innerHTML = "AI search failed.";
                resultsGrid.innerHTML = `<div class="col-12 text-center"><h5>❌ AI search failed.</h5></div>`;
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            resultsWrapper.style.display = "none";
            resultsGrid.innerHTML = "";
            resultsMeta.innerHTML = "";
            previewImage.src = "";
            previewImage.style.display = "none";
            aiInput.value = "";
            loadingBox.style.display = "none";
            normalProductsSection.style.display = "block";

            setTimeout(() => {
                productsWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        });
    }
});
</script>

@include('customer.cart')

@endsection