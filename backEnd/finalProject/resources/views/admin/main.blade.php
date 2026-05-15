@include('admin.layouts.head')
<div class="container-scroller">
    @include('admin.layouts.sidebar')
    <div class="container-fluid page-body-wrapper">
        @include('admin.layouts.navbar')
        <div class="main-panel">
          <div class="content-wrapper">
            @include('admin.layouts.alert')
            @yield('body')
            @include('admin.layouts.footer')
          </div>
        </div>
    </div>