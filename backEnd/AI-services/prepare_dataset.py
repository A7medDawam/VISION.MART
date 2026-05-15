import os
import shutil
import random
import pymysql
DB_HOST = "127.0.0.1"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "finalproject"

IMAGE_ROOT = r"/home/a7med/Desktop/courses/AOU/Final_project/code/backEnd/finalProject/storage/app/public"
OUTPUT_DIR = "dataset"

SAMPLES_PER_CLASS = 900
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15

CATEGORY_MAP = {
    1: "bags",
    2: "clothing",
    3: "accessories",
    4: "shoes",
    5: "electronics",
}

for split in ["train", "val", "test"]:
    for class_name in CATEGORY_MAP.values():
        os.makedirs(os.path.join(OUTPUT_DIR, split, class_name), exist_ok=True)

conn = pymysql.connect(
    host=DB_HOST,
    user=DB_USER,
    password=DB_PASSWORD,
    database=DB_NAME,
    charset="utf8mb4"
)

cursor = conn.cursor()

for category_id, class_name in CATEGORY_MAP.items():
    query = f"""
        SELECT image
        FROM products
        WHERE category_id = %s
          AND image IS NOT NULL
          AND image != ''
        ORDER BY RAND()
        LIMIT {SAMPLES_PER_CLASS}
    """
    cursor.execute(query, (category_id,))
    rows = cursor.fetchall()

    images = [row[0] for row in rows]
    random.shuffle(images)

    total = len(images)
    train_end = int(total * TRAIN_RATIO)
    val_end = train_end + int(total * VAL_RATIO)

    train_images = images[:train_end]
    val_images = images[train_end:val_end]
    test_images = images[val_end:]

    def copy_files(file_list, split_name):
        copied = 0
        missing = 0

        for rel_path in file_list:
            src = os.path.join(IMAGE_ROOT, rel_path)
            filename = os.path.basename(rel_path)
            dst = os.path.join(OUTPUT_DIR, split_name, class_name, filename)

            if os.path.exists(src):
                shutil.copy2(src, dst)
                copied += 1
            else:
                print(f"[WARNING] File not found: {src}")
                missing += 1

        print(f"{class_name} | {split_name} | copied={copied}, missing={missing}")

    copy_files(train_images, "train")
    copy_files(val_images, "val")
    copy_files(test_images, "test")

cursor.close()
conn.close()

print("Done! Dataset prepared successfully.")