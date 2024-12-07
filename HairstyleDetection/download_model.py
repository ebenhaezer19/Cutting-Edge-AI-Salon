import requests
import os
import bz2

def download_model():
    model_url = "https://github.com/davisking/dlib-models/raw/master/shape_predictor_68_face_landmarks.dat.bz2"
    compressed_model_path = "shape_predictor_68_face_landmarks.dat.bz2"
    final_model_path = "shape_predictor_68_face_landmarks.dat"
    
    print("Downloading face landmarks model...")
    response = requests.get(model_url, stream=True)
    response.raise_for_status()
    
    # Save compressed file
    with open(compressed_model_path, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            f.write(chunk)
    
    print("Extracting model...")
    # Decompress the file
    with bz2.BZ2File(compressed_model_path) as fr, open(final_model_path, 'wb') as fw:
        fw.write(fr.read())
    
    # Remove compressed file
    os.remove(compressed_model_path)
    print("Model ready!")

if __name__ == "__main__":
    download_model() 