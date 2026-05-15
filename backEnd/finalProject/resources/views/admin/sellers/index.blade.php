{{-- @extends('admin.main')
@section('title','sellers managemen')

@section('body')

<div class="row">

    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
        <div class="card-body">
            <h4 class="card-title">Sellers Table</h4>
            <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th> Profile </th>
                    <th> Name</th>
                    <th> Email</th>
                    <th> Remove Seller </th>
                </tr>
                </thead>
                <tbody>
                @foreach($sellers as $seller)
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
                
                    <td>
                    <a href="{{ route('admin.delete-seller', $seller->id) }}" class="btn btn-inverse-danger btn-fw">
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
</div>
    @endsection --}}

    @extends('admin.main')
@section('title','sellers management')

@section('body')

<div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Sellers Table</h4>

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
                        @foreach($sellers as $seller)
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
                {{-- {{ $sellers->links() }} --}}
            </div>
            {{ $sellers->links() }}


        </div>
    </div>
</div>

@endsection