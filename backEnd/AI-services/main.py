import os

os.environ.setdefault('TF_CPP_MIN_LOG_LEVEL', os.environ.get('TF_CPP_MIN_LOG_LEVEL', '2'))

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json
import pymysql
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI(title="VISION.MART AI Service")

FRONTEND_ORIGINS = os.environ.get(
    'FRONTEND_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000'
)
allow_origins = [o.strip() for o in FRONTEND_ORIGINS.split(',') if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "product_classifier_v2.keras"
CLASSES_PATH = "class_names.json"
IMG_SIZE = (224, 224)
EMBEDDING_BATCH_SIZE = 32

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

if not os.path.exists(CLASSES_PATH):
    raise FileNotFoundError(f"class_names.json not found: {CLASSES_PATH}")

model = tf.keras.models.load_model(MODEL_PATH)

with open(CLASSES_PATH, "r") as f:
    class_names = json.load(f)

feature_model = tf.keras.Model(
    inputs=model.input,
    outputs=model.layers[-3].output
)

category_map = {
    "bags": 1,
    "clothing": 2,
    "accessories": 3,
    "shoes": 4,
    "electronics": 5
}


def get_db_connection():
    return pymysql.connect(
        host="127.0.0.1",
        user="root",
        password="",
        database="finalproject",
        charset="utf8mb4",
        cursorclass=pymysql.cursors.DictCursor
    )


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = image.resize(IMG_SIZE)
        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)
        return image_array
    except Exception as e:
        raise ValueError(f"Invalid image data: {e}")


def preprocess_image_from_path(image_path: str) -> np.ndarray:
    try:
        image = Image.open(image_path).convert("RGB")
        image = image.resize(IMG_SIZE)
        image_array = np.array(image, dtype=np.float32)
        image_array = np.expand_dims(image_array, axis=0)
        return image_array
    except Exception as e:
        raise ValueError(f"Cannot open image at path {image_path}: {e}")


def extract_embedding_from_bytes(image_bytes: bytes):
    image = preprocess_image(image_bytes)
    try:
        embedding = feature_model.predict(image, verbose=0)[0]
        return embedding
    except Exception as e:
        raise ValueError(f"Failed to extract embedding from bytes: {e}")


def extract_embedding_from_path(image_path: str):
    image = preprocess_image_from_path(image_path)
    try:
        embedding = feature_model.predict(image, verbose=0)[0]
        return embedding
    except Exception as e:
        raise ValueError(f"Failed to extract embedding from path: {e}")


def get_products_by_category(category_id, limit=300):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT id, name, description, price, image, category_id
        FROM products
        WHERE category_id = %s
          AND image IS NOT NULL
          AND image != ''
        ORDER BY id DESC
        LIMIT %s
    """

    cursor.execute(query, (category_id, limit))
    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return rows


@app.get("/")
def root():
    return {"message": "VISION.MART AI service is running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "num_classes": len(class_names),
        "classes": class_names
    }


@app.post("/predict-category")
async def predict_category(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        image = preprocess_image(image_bytes)
        predictions = model.predict(image, verbose=0)[0]

        predicted_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        predicted_category = class_names[predicted_index]

        top_predictions = []
        for i, score in enumerate(predictions):
            top_predictions.append({
                "category": class_names[i],
                "confidence": float(score)
            })

        top_predictions = sorted(
            top_predictions,
            key=lambda x: x["confidence"],
            reverse=True
        )

        return {
            "predicted_category": predicted_category,
            "category_id": category_map.get(predicted_category),
            "confidence": confidence,
            "top_predictions": top_predictions[:3]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search-by-image")
async def search_by_image(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")

    image_bytes = await file.read()

    if not image_bytes:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    try:
        #  predict category
        image = preprocess_image(image_bytes)
        predictions = model.predict(image, verbose=0)[0]

        predicted_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))
        predicted_category = class_names[predicted_index]
        category_id = category_map.get(predicted_category)

        if not category_id:
            raise HTTPException(status_code=400, detail="Could not map predicted category to database category")

        #  query embedding
        try:
            query_embedding = extract_embedding_from_bytes(image_bytes).reshape(1, -1)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        #  get candidate products in same category
        products = get_products_by_category(category_id, limit=300)

        results = []

        # Prepare valid product paths
        storage_base = "/home/a7med/Desktop/courses/AOU/Final_project/code/backEnd/finalProject/storage/app/public"
        valid_items = []
        for product in products:
            image_rel_path = product.get("image")
            if not image_rel_path:
                continue
            image_abs_path = os.path.join(storage_base, image_rel_path)
            if not os.path.exists(image_abs_path):
                continue
            valid_items.append((product, image_abs_path))

        if not valid_items:
            return {
                "predicted_category": predicted_category,
                "category_id": category_id,
                "confidence": confidence,
                "results": []
            }

        # Process in batches to reduce model calls
        batch_size = EMBEDDING_BATCH_SIZE
        for i in range(0, len(valid_items), batch_size):
            batch = valid_items[i:i+batch_size]
            # load images for this batch
            batch_images = []
            batch_products = []
            for product, path in batch:
                try:
                    img = Image.open(path).convert("RGB")
                    img = img.resize(IMG_SIZE)
                    arr = np.array(img, dtype=np.float32)
                    batch_images.append(arr)
                    batch_products.append(product)
                except Exception:
                    # skip this product if the image cannot be read/processed
                    continue

            if not batch_images:
                continue

            batch_images_array = np.stack(batch_images, axis=0)
            try:
                batch_embeddings = feature_model.predict(batch_images_array, verbose=0)
            except Exception:
                # skip this batch if model inference fails for any reason
                continue

            # compute similarities in one call (guarded)
            try:
                sims = cosine_similarity(query_embedding, batch_embeddings)[0]
            except Exception:
                # skip this batch if similarity computation fails
                continue
            for idx, product in enumerate(batch_products):
                try:
                    similarity = float(sims[idx])
                    results.append({
                        "id": product.get("id"),
                        "name": product.get("name"),
                        "description": product.get("description"),
                        "price": float(product.get("price", 0)),
                        "image": product.get("image"),
                        "category_id": product.get("category_id"),
                        "similarity": similarity
                    })
                except Exception:
                    continue

        results = sorted(results, key=lambda x: x["similarity"], reverse=True)[:8]

        return {
            "predicted_category": predicted_category,
            "category_id": category_id,
            "confidence": confidence,
            "results": results
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
