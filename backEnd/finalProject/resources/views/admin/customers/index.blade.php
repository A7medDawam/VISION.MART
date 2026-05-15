
@extends('admin.main')
@section('title','customers management')

@section('body')

<div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
        <div class="card-body">
            <h4 class="card-title">Customers Table</h4>

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
                        @foreach($customers as $customer)
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
            {{ $customers->links() }}


        </div>
    </div>
</div>

@endsection