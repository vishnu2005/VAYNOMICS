import requests
import os

def download_model():
    file_id = "1UvGeHimLrOdimITapAykGHCcCNp4B1Ai"  # Replace with your real ID
    url = f"https://drive.google.com/uc?export=download&id={file_id}"
    model_path = "multitype_uber_model.pkl"

    if not os.path.exists(model_path):
        print("Downloading ML model from Google Drive...")
        try:
            response = requests.get(url)
            response.raise_for_status()
            with open(model_path, "wb") as f:
                f.write(response.content)
            print("✅ Model downloaded successfully!")
        except Exception as e:
            print(f"❌ Error downloading model: {e}")
    else:
        print("✅ Model already exists.")

if __name__ == "__main__":
    download_model()
