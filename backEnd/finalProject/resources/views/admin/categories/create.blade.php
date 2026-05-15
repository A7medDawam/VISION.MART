
@extends('admin.main')
@section('title','category')
    
@section('body')

<div class="col-md-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Create Category</h4>
        <form class="forms-sample" action="{{route('admin.store-category')}}" method="post">
          @csrf
          <div class="form-group">
            <label for="exampleInputUsername1">Name</label>
            <input type="text" name="name" class="form-control" id="exampleInputUsername1" placeholder="Username">
          </div>
          <button type="submit" class="btn btn-primary me-2">Submit</button>
        </form>
      </div>
    </div>
  </div>
@endsection