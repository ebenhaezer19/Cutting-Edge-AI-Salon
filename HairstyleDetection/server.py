from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import base64
import dlib
from setup import process_frame, setup_database

app = Flask(__name__)
CORS(app)

# Initialize face detector and predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# Setup database
setup_database()

@app.route('/analyze-face', methods=['POST'])
def analyze_face():
    try:
        # Get image data from request
        data = request.get_json()
        image_data = data['image'].split(',')[1]
        image_bytes = base64.b64decode(image_data)
        
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Process the image
        processed_frame, results = process_frame(image, detector, predictor)
        
        if results:
            return jsonify(results[0])
        else:
            return jsonify({'success': False, 'error': 'No face detected'})
            
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

if __name__ == '__main__':
    print("Server starting...")
    print("Make sure you have downloaded the shape predictor model!")
    app.run(debug=True) 