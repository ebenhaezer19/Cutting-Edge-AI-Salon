from flask import Flask, request, jsonify
from flask_cors import CORS
import dlib
import numpy as np
import cv2
import base64
import io
from PIL import Image
import os
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Konfigurasi CORS yang lebih permisif untuk development
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Izinkan semua origin untuk development
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "max_age": 3600
    }
})

# Load model face landmark detector
try:
    base_path = os.path.dirname(os.path.abspath(__file__))
    predictor_path = os.path.join(base_path, "shape_predictor_68_face_landmarks.dat")
    
    if not os.path.exists(predictor_path):
        raise FileNotFoundError(f"Model tidak ditemukan di: {predictor_path}")
        
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor(predictor_path)
    logger.info("Model berhasil dimuat!")
    
except Exception as e:
    logger.error(f"Error saat memuat model: {str(e)}")
    logger.error("Pastikan model sudah diunduh dengan menjalankan: python download_model.py")
    exit(1)

@app.route('/analyze-face', methods=['POST', 'OPTIONS'])
def analyze_face():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'})
        
    try:
        logger.debug("Menerima request analyze-face")
        
        # Validasi request
        if not request.is_json:
            logger.error("Request bukan JSON")
            return jsonify({'error': 'Content-Type harus application/json'}), 400
            
        data = request.get_json()
        if not data or 'image' not in data:
            logger.error("Data gambar tidak ditemukan dalam request")
            return jsonify({'error': 'Data gambar tidak ditemukan'}), 400
            
        # Decode base64 image
        try:
            image_data = data['image'].split(',')[1]
            image_bytes = base64.b64decode(image_data)
        except Exception as e:
            logger.error(f"Error saat decode gambar: {str(e)}")
            return jsonify({'error': f'Error saat decode gambar: {str(e)}'}), 400
        
        # Konversi ke format yang bisa diproses
        try:
            image = Image.open(io.BytesIO(image_bytes))
            image_np = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        except Exception as e:
            logger.error(f"Error saat memproses gambar: {str(e)}")
            return jsonify({'error': f'Error saat memproses gambar: {str(e)}'}), 400
        
        # Deteksi wajah
        faces = detector(image_np)
        if len(faces) == 0:
            logger.warning("Tidak ada wajah terdeteksi dalam gambar")
            return jsonify({'error': 'Tidak ada wajah terdeteksi dalam gambar'}), 400
            
        # Ambil face landmark untuk wajah pertama yang terdeteksi
        face = faces[0]
        landmarks = predictor(image_np, face)
        
        # Konversi landmark ke format JSON
        points = []
        for i in range(68):
            point = landmarks.part(i)
            points.append({
                'x': int(point.x),
                'y': int(point.y)
            })
            
        response_data = {
            'success': True,
            'landmarks': points,
            'face': {
                'left': int(face.left()),
                'top': int(face.top()),
                'right': int(face.right()),
                'bottom': int(face.bottom())
            }
        }
        
        logger.debug("Berhasil memproses gambar dan mendeteksi landmark")
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"Error tidak terduga: {str(e)}")
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == '__main__':
    logger.info("Starting server...")
    # Gunakan threaded=True untuk menangani multiple requests
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True) 