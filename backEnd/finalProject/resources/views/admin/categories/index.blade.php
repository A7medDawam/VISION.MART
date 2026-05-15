
@extends('admin.main')
@section('title','category')
    
@section('body')

    <div class="col-lg-12 grid-margin stretch-card">
    <div class="card">
      <a href="{{route('admin.create-category')}}" class="btn btn-primary btn-rounded btn-fw "style='width: 25px'>Create Category</a>
      <div class="card-body">
        <h4 class="card-title"> Categories</h4>
        <div class="table-responsive">
          <table class="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name.</th>
                <th>Created</th>
                <th>Status</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
            @foreach ($categories as $category)
                    
              <tr>
                <td>{{$loop->iteration}}</td>
                <td>{{$category->name}}</td>
                <td>{{$category->created_at}}</td>
                <td><label>{{$category->status == 1 ? 'Active' : 'Inactive'}}</label></td>
                <td><a href="{{route('admin.edit-category',$category->id)}}" class="btn btn-inverse-success btn-fw">Edit</a></td>
                <td><a href="{{route('admin.delete-category',$category->id)}}" class="btn btn-inverse-danger btn-fw">Delete</a></td>
              </tr>
            @endforeach

            </tbody>
          </table>
          {{ $categories->links() }}
        </div>
      </div>
    </div>
  </div>
@endsection