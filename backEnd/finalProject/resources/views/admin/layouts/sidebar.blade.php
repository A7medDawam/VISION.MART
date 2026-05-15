<nav class="sidebar sidebar-offcanvas" id="sidebar">
        <div class="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a class="sidebar-brand brand-logo" href="index.html"><img src="{{asset('admin/')}}/assets/images/logo.svg" alt="logo" /></a>
          <a class="sidebar-brand brand-logo-mini" href="index.html"><img src="{{asset('admin/')}}/assets/images/logo-mini.svg" alt="logo" /></a>
        </div>
        <ul class="nav">
          <li class="nav-item profile">
            <div class="profile-desc">
              <div class="profile-pic">
                <div class="count-indicator">
                  <img
                  class="img-xs rounded-circle"
                  src="{{ auth()->user()->image
                      ? asset('storage/' . auth()->user()->image)
                      : 'https://ui-avatars.com/api/?name=' . urlencode(auth()->user()->name) }}"
                  alt=""
                  >
                  <span class="count bg-success"></span>
                </div>
                <div class="profile-name">
                  <h5 class="mb-0 font-weight-normal">{{auth()->user()->name}}</h5>
                  <span>{{ auth()->user()->role }}</span>
                </div>
              </div>

            </div>
          </li>

          <!-- side bar -->

          <li class="nav-item menu-items">
            <a class="nav-link" href="{{route('admin.dashboard')}}">
              <span class="menu-icon">
                <i class="mdi mdi-speedometer"></i>
              </span>
              <span class="menu-title">Dashboard</span>
            </a>
          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" href="{{route('admin.category')}}" >
              <span class="menu-icon">
                <i class="mdi mdi-format-list-bulleted-type"></i>
              </span>
              <span class="menu-title">Categories</span>
            </a>

          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" href="{{route('admin.product')}}" >
              <span class="menu-icon">
                <i class="mdi mdi-tshirt-crew"></i>
              </span>
              <span class="menu-title">Products</span>
            </a>

          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" href="{{route('admin.sellers')}}" >
              <span class="menu-icon">
                <i class="fa fa-user-circle-o"></i>
              </span>
              <span class="menu-title">Sellers</span>
            </a>

          </li>
          <li class="nav-item menu-items">
            <a class="nav-link" href="{{route('admin.customers')}}" >
              <span class="menu-icon">
                <i class="fa fa-user-o"></i>
              </span>
              <span class="menu-title">Customers</span>
            </a>

          </li>
      
        </ul>
      </nav>