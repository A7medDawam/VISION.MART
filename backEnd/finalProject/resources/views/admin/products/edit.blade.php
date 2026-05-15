
@extends('admin.main')
@section('title','product')
    
@section('body')

<div class="col-md-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Edit Product</h4>
        <form class="forms-sample" action="{{route('admin.update-product',$product->id)}}" method="post" enctype="multipart/form-data">
          @csrf
          <div class="form-group">
            <label for="exampleInputUsername1">Name</label>
            <input type="text" name="name" class="form-control" value="{{$product->name}}" placeholder="Name">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Description</label>
            <input type="text" name="description" class="form-control" value="{{$product->description}}" placeholder="Description">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Price</label>
            <input type="number" name="price" class="form-control" value="{{$product->price}}" placeholder="Price">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Quantity</label>
            <input type="number" name="quantity" class="form-control" value="{{$product->quantity}}" placeholder="Quantity">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Product Image</label>
            <input type="file" name="image" class="form-control-file"  placeholder="Chose Image">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1" class="mt-2 me-2">Category</label>
            <select name="category_id" class="btn btn-sm btn-outline-primary dropdown-toggle">
              @foreach ($categories as $category)
                  <option value="{{$category->id}}">{{$category->name}}</option>
              @endforeach
            </select>
          </div>
          <button type="submit" class="btn btn-primary me-2">Submit</button>
        </form>
      </div>
    </div>
  </div>
@endsection