@include('customer.layouts.head')

<body>

    <!-- Spinner Start -->
    <div id="spinner"
        class="show bg-white position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    </div>
    <!-- Spinner End -->


    <!-- Topbar Start -->


    <!-- Topbar End -->
    @include('customer.layouts.topnavbar')
    <!-- Navbar & Hero Start -->

    <!-- Navbar & Hero End -->

    <!-- Carousel Start -->
    @include('customer.layouts.banner')
    <!-- Carousel End -->

    




    <!-- Our Products Start -->
    @yield('body')
    <!-- Our Products End -->

    @include('customer.layouts.footer')

  
  