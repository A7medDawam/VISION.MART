@include('seller.layouts.head')
<div class="container-scroller">
    @include('seller.layouts.sidebar')
    <div class="container-fluid page-body-wrapper">
        @include('seller.layouts.navbar')
        <div class="main-panel">
          <div class="content-wrapper">
            @include('seller.layouts.alert')
            @yield('body')
            @include('seller.layouts.footer')
