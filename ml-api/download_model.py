import requests
import os

def download_model():
    model_url = "https://www.dropbox.com/scl/fi/db3pyotpurmfc8y8wmpej/multitype_uber_model.pkl?rlkey=jv1u5ebxlzadqv7ep5pnhrw65&st=utoybe57&dl=1"
    model_path = "multitype_uber_model.pkl"

    if not os.path.exists(model_path):
        print("📦 Downloading ML model from Dropbox...")
        try:
            response = requests.get(model_url)
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

