import cv2
import dlib
import face_recognition
import sqlite3
import numpy as np
import argparse
from datetime import datetime

def setup_database():
    """Create and populate the hairstyles database"""
    conn = sqlite3.connect('hairstyles.db')
    c = conn.cursor()
    
    # Create table for hairstyles
    c.execute('''
        CREATE TABLE IF NOT EXISTS hairstyles
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         name TEXT NOT NULL,
         face_shape TEXT NOT NULL,
         description TEXT NOT NULL)
    ''')
    
    # Create log table
    c.execute('''
        CREATE TABLE IF NOT EXISTS log
        (log_id INTEGER PRIMARY KEY AUTOINCREMENT,
         timestamp TEXT NOT NULL,
         face_shape TEXT NOT NULL,
         hairstyle_id INTEGER,
         FOREIGN KEY(hairstyle_id) REFERENCES hairstyles(id))
    ''')
    
    # Sample hairstyle data
    hairstyles = [
        ('Layer Pendek', 'Bulat', 'Potongan layer pendek dengan poni samping untuk memberikan ilusi wajah lebih panjang'),
        ('Bob Panjang', 'Bulat', 'Potongan bob di bawah dagu dengan layer untuk membingkai wajah'),
        ('Pixie Cut', 'Oval', 'Potongan pendek dengan tekstur di bagian atas'),
        ('Long Layers', 'Oval', 'Rambut panjang berlayer dengan poni samping'),
        ('Side-Swept Bangs', 'Kotak', 'Poni menyamping untuk melunakkan garis rahang'),
        ('Textured Crop', 'Kotak', 'Potongan pendek bertekstur untuk menyeimbangkan fitur wajah')
    ]
    
    # Insert data if not exists
    c.execute('SELECT COUNT(*) FROM hairstyles')
    if c.fetchone()[0] == 0:
        c.executemany('INSERT INTO hairstyles (name, face_shape, description) VALUES (?, ?, ?)', hairstyles)
    
    conn.commit()
    conn.close()

def get_accurate_face_shape(landmarks):
    """Calculate face shape based on landmarks with enhanced accuracy"""
    points = np.array([(landmarks.part(n).x, landmarks.part(n).y) for n in range(68)])
    
    # Calculate various facial dimensions
    jaw_width = np.linalg.norm(points[16] - points[0])
    face_height = np.linalg.norm(points[8] - points[27])
    cheek_width = np.linalg.norm(points[14] - points[2])
    forehead_width = np.linalg.norm(points[24] - points[19])
    nose_length = np.linalg.norm(points[33] - points[27])
    chin_length = np.linalg.norm(points[8] - points[33])
    
    # Calculate ratios
    width_height_ratio = jaw_width / face_height
    cheek_jaw_ratio = cheek_width / jaw_width
    forehead_ratio = forehead_width / jaw_width
    nose_chin_ratio = nose_length / chin_length
    
    # Determine face shape based on multiple criteria
    if width_height_ratio < 0.8 and cheek_jaw_ratio < 1.2 and nose_chin_ratio < 0.5:
        return 'Oval'
    elif width_height_ratio >= 0.8 and cheek_jaw_ratio > 1.3 and nose_chin_ratio > 0.5:
        return 'Kotak'
    elif forehead_ratio > 0.7 and nose_chin_ratio < 0.5:
        return 'Bulat'
    elif width_height_ratio < 0.75 and cheek_jaw_ratio < 1.1 and nose_chin_ratio > 0.5:
        return 'Heart'
    elif width_height_ratio < 0.75 and cheek_jaw_ratio > 1.1 and nose_chin_ratio < 0.5:
        return 'Oblong'
    elif width_height_ratio > 0.75 and cheek_jaw_ratio < 1.1 and nose_chin_ratio > 0.5:
        return 'Square'
    else:
        return 'Round'

def log_analysis(face_shape, hairstyles):
    """Log analysis results in the database"""
    conn = sqlite3.connect('hairstyles.db')
    c = conn.cursor()
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    for hairstyle in hairstyles:
        c.execute('INSERT INTO log (timestamp, face_shape, hairstyle_id) VALUES (?, ?, ?)', 
                  (timestamp, face_shape, hairstyle[0]))
    
    conn.commit()
    conn.close()

def get_hairstyles_by_face_shape(face_shape):
    """Get hairstyle recommendations for a given face shape"""
    conn = sqlite3.connect('hairstyles.db')
    c = conn.cursor()
    c.execute('SELECT * FROM hairstyles WHERE face_shape = ?', (face_shape,))
    results = c.fetchall()
    conn.close()
    return results

def show_histogram(image):
    """Display color histogram for skin tone analysis"""
    color = ('b', 'g', 'r')
    for i, col in enumerate(color):
        histr = cv2.calcHist([image], [i], None, [256], [0, 256])
        cv2.plot(histr, color=col)
        cv2.title('Color Histogram')
    cv2.show()

def process_frame(frame, detector, predictor):
    """Process a single frame and return analyzed frame with results"""
    # Tambahkan preprocessing
    frame = cv2.resize(frame, (0, 0), fx=1.5, fy=1.5)  # Perbesar gambar
    frame = cv2.GaussianBlur(frame, (3,3), 0)  # Reduce noise
    
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)
    results = []
    
    for face_location in face_locations:
        top, right, bottom, left = face_location
        
        # Draw face rectangle
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        
        # Get face region
        face_image = rgb_frame[top:bottom, left:right]
        face_gray = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)
        
        # Detect face in the cropped region
        dlib_faces = detector(face_gray)
        
        if dlib_faces:
            # Get landmarks
            landmarks = predictor(face_gray, dlib_faces[0])
            
            # Draw landmarks
            for n in range(68):
                x = landmarks.part(n).x + left
                y = landmarks.part(n).y + top
                cv2.circle(frame, (x, y), 2, (0, 0, 255), -1)
            
            # Get face shape
            face_shape = get_accurate_face_shape(landmarks)
            
            # Get hairstyle recommendations
            hairstyles = get_hairstyles_by_face_shape(face_shape)
            
            results.append({
                'face_shape': face_shape,
                'hairstyles': hairstyles
            })
            
            # Log the analysis
            log_analysis(face_shape, hairstyles)
            
            # Draw face shape text
            cv2.putText(frame, f"Face Shape: {face_shape}", 
                       (left, top - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 
                       0.8, 
                       (0, 255, 0), 
                       2)
    
    return frame, results

def main():
    parser = argparse.ArgumentParser(description='Face Shape Analysis')
    parser.add_argument('--mode', choices=['camera', 'image'], default='camera',
                       help='Choose between camera or image mode')
    parser.add_argument('--image', default='Bulat.jpg',
                       help='Image file path (only used in image mode)')
    args = parser.parse_args()

    # Setup database
    setup_database()
    
    # Initialize face detector and predictor
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")  # Model dengan lebih banyak landmark



    if args.mode == 'camera':
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("Error: Could not open camera")
            return
        else:
            print("Camera opened successfully")

        print("\nKamera mode aktif:")
        print("- Tekan 'q' untuk keluar")
        print("- Tekan 's' untuk mengambil screenshot")
        print("- Tekan 'r' untuk melihat rekomendasi gaya rambut\n")

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            processed_frame, results = process_frame(frame, detector, predictor)
            cv2.imshow('Face Analysis (Press q to quit, s for screenshot, r for recommendations)', processed_frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s'):
                cv2.imwrite('face_analysis_screenshot.jpg', processed_frame)
                print("Screenshot saved as 'face_analysis_screenshot.jpg'")
            elif key == ord('r'):
                for result in results:
                    print(f"\nBentuk wajah terdeteksi: {result['face_shape']}")
                    print(f"Rekomendasi gaya rambut untuk bentuk wajah {result['face_shape']}:")
                    for hairstyle in result['hairstyles']:
                        print(f"- {hairstyle[1]}")
                        print(f"  Deskripsi: {hairstyle[3]}\n")

        cap.release()

    else:  
        try:
            image = cv2.imread(args.image)
            if image is None:
                raise ValueError(f"Could not load image from {args.image}")
            
            processed_image, results = process_frame(image, detector, predictor)
            
            for result in results:
                print(f"\nBentuk wajah terdeteksi: {result['face_shape']}")
                print(f"Rekomendasi gaya rambut untuk bentuk wajah {result['face_shape']}:")
                for hairstyle in result['hairstyles']:
                    print(f"- {hairstyle[1]}")
                    print(f"  Deskripsi: {hairstyle[3]}\n")
            
            cv2.imshow("Face Analysis", processed_image)
            cv2.waitKey(0)
            
        except Exception as e:
            print(f"Error: {e}")
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()
