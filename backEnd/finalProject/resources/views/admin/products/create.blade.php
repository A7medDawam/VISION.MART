
@extends('admin.main')
@section('title','product')
    
@section('body')

<div class="col-md-12 grid-margin stretch-card">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Create Product</h4>
        <form class="forms-sample" action="{{route('admin.store-product')}}" method="post" enctype="multipart/form-data">
          @csrf
          <div class="form-group">
            <label for="exampleInputUsername1">Name</label>
            <input type="text" name="name" class="form-control" id="exampleInputUsername1" placeholder="Name">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Description</label>
            <input type="text" name="description" class="form-control" id="exampleInputUsername1" placeholder="Description">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Price</label>
            <input type="number" name="price" class="form-control" id="exampleInputUsername1" placeholder="Price">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Quantity</label>
            <input type="number" name="quantity" class="form-control" id="exampleInputUsername1" placeholder="Quantity">
          </div>
          <div class="form-group">
            <label for="exampleInputUsername1">Product Image</label>
            <input type="file" name="image" class="form-control" id="exampleInputUsername1" placeholder="Chose Image">
            <div id="ai-result" class="alert alert-info mt-2" style="display:none;"></div>
          </div>
          
          <div class="form-group">
            <label for="exampleInputUsername1" class="mt-2 me-2">Category</label>
            <select name="category_id" class="btn btn-sm btn-outline-primary dropdown-toggle">
              <option value="" selected disabled>-- Select Category --</option>
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
  <script>
    document.addEventListener("DOMContentLoaded", function () {
        const imageInput = document.querySelector('input[name="image"]');
        const categorySelect = document.querySelector('select[name="category_id"]');
        const resultDiv = document.getElementById('ai-result');
    
        imageInput.addEventListener('change', async function () {
            const file = this.files[0];
            if (!file) return;
    
            const formData = new FormData();
            formData.append('file', file);
    
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = "⏳ AI is analyzing image...";
    
            try {
                const res = await fetch('http://127.0.0.1:8001/predict-category', {
                    method: 'POST',
                    body: formData
                });
    
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error("API ERROR:", errorText);
                    throw new Error("AI API failed");
                }
    
                const data = await res.json();
                console.log("AI RESPONSE:", data);
    
                const confidence = (data.confidence * 100).toFixed(2);
    
                resultDiv.innerHTML = `
                    🤖 AI Suggests: <strong>${data.predicted_category}</strong> (${confidence}%)
                `;
    
                if (categorySelect && data.category_id) {
                    categorySelect.value = data.category_id;
                }
    
            } catch (err) {
                console.error(err);
                resultDiv.innerHTML = "❌ AI failed. Try again.";
            }
        });
    });
    </script>

@endsection