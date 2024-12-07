import requests
import os
import sys
import bz2
import dlib

def download_model():
    # URL model dari dlib official
    model_url = "http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2"
    
    # Lokasi penyimpanan model (dalam folder HairstyleDetection)
    base_path = os.path.dirname(os.path.abspath(__file__))
    compressed_path = os.path.join(base_path, "shape_predictor_68_face_landmarks.dat.bz2")
    model_path = os.path.join(base_path, "shape_predictor_68_face_landmarks.dat")
    
    try:
        if os.path.exists(model_path):
            print("Model sudah tersedia")
            return
            
        print("Mengunduh model...")
        response = requests.get(model_url, stream=True)
        response.raise_for_status()
        
        # Dapatkan ukuran file
        total_size = int(response.headers.get('content-length', 0))
        block_size = 1024  # 1 Kibibyte
        
        # Unduh file terkompresi dengan progress bar
        with open(compressed_path, 'wb') as f:
            downloaded = 0
            for data in response.iter_content(block_size):
                downloaded += len(data)
                f.write(data)
                # Update progress
                done = int(50 * downloaded / total_size)
                sys.stdout.write('\r[{}{}] {:.1f}%'.format(
                    '=' * done, 
                    ' ' * (50-done), 
                    downloaded * 100 / total_size
                ))
                sys.stdout.flush()
        
        print("\nMengekstrak model...")
        # Ekstrak file bz2
        with open(model_path, 'wb') as new_file:
            with bz2.BZ2File(compressed_path, 'rb') as file:
                for data in iter(lambda: file.read(100 * 1024), b''):
                    new_file.write(data)
        
        # Hapus file terkompresi
        os.remove(compressed_path)
        print("Model berhasil diunduh dan diekstrak!")
        
    except Exception as e:
        print(f"\nTerjadi kesalahan saat mengunduh model: {str(e)}")
        # Bersihkan file yang tidak lengkap
        if os.path.exists(compressed_path):
            os.remove(compressed_path)
        if os.path.exists(model_path):
            os.remove(model_path)
        print("Silakan coba unduh ulang.")

if __name__ == "__main__":
    download_model()
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                             "shape_predictor_68_face_landmarks.dat")
    if os.path.exists(model_path):
        print("Model tersedia")
        print(f"Ukuran file: {os.path.getsize(model_path) / (1024*1024):.2f} MB")
        
        # Test model
        try:
            predictor = dlib.shape_predictor(model_path)
            print("Model berhasil dimuat!")
        except Exception as e:
            print(f"Error saat memuat model: {str(e)}")