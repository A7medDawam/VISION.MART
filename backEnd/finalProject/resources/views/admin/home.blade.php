
@extends('admin.main')
@section('title','home')
    
@section('body')
     <div class="row">
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">$12.34</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">+3.5%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success ">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">Potential growth</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">$17.34</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">+11%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">Revenue current</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">$12.34</h3>
                          <p class="text-danger ms-2 mb-0 font-weight-medium">-2.4%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-danger">
                          <span class="mdi mdi-arrow-bottom-left icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">Daily Income</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">$31.53</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">+3.5%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success ">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">Expense current</h6>
                  </div>
                </div>
              </div>
                    
              {{-- only admin product --}}

              <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                  <a href="{{route('admin.create-product')}}" class="btn btn-primary btn-rounded btn-fw "style='width: 25px'>Create Product</a>
                  <div class="card-body">
                    <h4 class="card-title">My products</h4>
                    <div class="table-responsive">
                      <table class="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Created</th>
                            <th>Update</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                        @foreach ($myProducts as $product)
                                
                          <tr>
                            <td>{{$loop->iteration}}</td>
                            <td><img src="{{asset('storage/' . $product->image)}}" alt=""></td>
                            <td>{{$product->name}}</td>
                            <td>{{$product->description}}</td>
                            <td>{{$product->quantity}}</td>
                            <td>{{$product->price}}</td>
                            <td>{{$product->category->name}}</td>
                            <td>{{$product->created_at}}</td>
                            <td><a href="{{route('admin.edit-product',$product->id)}}" class="btn btn-inverse-success btn-fw">Edit</a></td>
                            <td><a href="{{route('admin.delete-product',$product->id)}}" class="btn btn-inverse-danger btn-fw">Delete</a></td>
                          </tr>
                        @endforeach
            
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              
              {{--latest seellers table --}}
              
              
              <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Sellers Table</h4>
                        <a href="{{ route('admin.sellers') }}" class="btn btn-sm btn-inverse-primary mb-3">View All Sellers</a>
                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Products Count</th>
                                        <th>Status</th>
                                        <th>Toggle Status</th>
                                        <th>Created At</th>
                                        <th>Remove Seller</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($latestSellers as $seller)
                                    <tr>
                                        <td class="py-1">
                                            <img
                                                src="{{ $seller->image
                                                    ? asset('storage/' . $seller->image)
                                                    : 'https://ui-avatars.com/api/?name=' . urlencode($seller->name) }}"
                                                alt="image">
                                        </td>
            
                                        <td>{{ $seller->name }}</td>
                                        <td>{{ $seller->email }}</td>
                                        <td>{{ $seller->products_count }}</td>
            
                                        <td>
                                            @if($seller->status == 1)
                                                <span class="text-success font-weight-bold">Active</span>
                                            @else
                                                <span class="text-danger font-weight-bold">Inactive</span>
                                            @endif
                                        </td>
            
                                        <td>
                                            <a href="{{ route('admin.toggle-seller-status', $seller->id) }}"
                                               class="btn btn-sm {{ $seller->status ? 'btn-inverse-warning' : 'btn-inverse-success' }}">
                                                {{ $seller->status ? 'Deactivate' : 'Activate' }}
                                            </a>
                                        </td>
            
                                        <td>{{ $seller->created_at->format('Y-m-d') }}</td>
            
                                        <td>
                                            <a href="{{ route('admin.delete-seller', $seller->id) }}"
                                               class="btn btn-inverse-danger btn-fw">
                                                Delete
                                            </a>
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>

                      </div>
                    </div>


              </div>



              {{--latest customers table --}}
              
    
              <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Customers Table</h4>
                        <a href="{{ route('admin.customers') }}" class="btn btn-sm btn-inverse-primary mb-3">View All customers</a>

                        <div class="table-responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Profile</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Orders Count</th>
                                        <th>Status</th>
                                        <th>Toggle Status</th>
                                        <th>Created At</th>
                                        <th>Remove Seller</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($latestCustomers as $customer)
                                    <tr>
                                        <td class="py-1">
                                            <img
                                                src="{{ $customer->image
                                                    ? asset('storage/' . $customer->image)
                                                    : 'https://ui-avatars.com/api/?name=' . urlencode($customer->name) }}"
                                                alt="image">
                                        </td>
            
                                        <td>{{ $customer->name }}</td>
                                        <td>{{ $customer->email }}</td>
                                          <td>{{ $customer->orders_count }}</td>  
                                        <td>
                                            @if($customer->status == 1)
                                                <span class="text-success font-weight-bold">Active</span>
                                            @else
                                                <span class="text-danger font-weight-bold">Inactive</span>
                                            @endif
                                        </td>
            
                                        <td>
                                            <a href="{{ route('admin.toggle-customer-status', $customer->id) }}"
                                                class="btn btn-sm {{ $customer->status ? 'btn-inverse-warning' : 'btn-inverse-success' }}">
                                                {{ $customer->status ? 'Deactivate' : 'Activate' }}
                                            </a>
                                        </td>
            
                                        <td>{{ $customer->created_at->format('Y-m-d') }}</td>
            
                                        <td>
                                            <a href="{{ route('admin.delete-customer', $customer->id) }}"
                                                class="btn btn-inverse-danger btn-fw">
                                                Delete
                                            </a>
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
            
            
                    </div>
                </div>
              </div>


@endsection