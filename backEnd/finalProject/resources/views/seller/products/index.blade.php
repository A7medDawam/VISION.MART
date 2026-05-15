
@extends('seller.main')
@section('title','product')
    
@section('body')

    <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <a href="{{route('seller.products.create')}}" class="btn btn-primary btn-rounded btn-fw "style='width: 25px'>Create Product</a>
      <div class="card-body">
        <h4 class="card-title"> products</h4>
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
            @foreach ($products as $product)
                    
              <tr>
                <td>{{$loop->iteration}}</td>
                <td><img src="{{asset('storage/' . $product->image)}}" alt=""></td>
                <td>{{$product->name}}</td>
                <td class="text-wrap" style="max-width: 300px; line-height: 1.5;">{{$product->description}}</td>
                <td>{{$product->quantity}}</td>
                <td>{{$product->price}}</td>
                <td class="text-wrap" style="max-width: 200px; line-height: 1.5;">{{$product->category->name}}</td>
                <td>{{$product->created_at}}</td>
                <td><a href="{{route('seller.products.edit',$product->id)}}" class="btn btn-inverse-success btn-fw">Edit</a></td>
                <td><a href="{{route('seller.products.delete',$product->id)}}" class="btn btn-inverse-danger btn-fw">Delete</a></td>
              </tr>
            @endforeach

            </tbody>
          </table>
          {{ $products->links() }}

        </div>
      </div>
    </div>
  </div>
@endsection