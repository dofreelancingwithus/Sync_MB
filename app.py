from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from keras.models import load_model
import base64
from io import BytesIO
from PIL import Image
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allows requests from React frontend

# Load the emotion detection model
model = load_model(r"C:\Users\abhin\Downloads\abhinav\works\mood_playlist - Copy\mood_playlist\python\models\fer2013_mini_XCEPTION.102-0.66.hdf5")
# FER2013 model emotion index to mood mapping
mood_mapping = {
    0: 'angry',      # angry
    1: 'calm',       # disgust -> mapped to calm
    2: 'calm',       # fear -> mapped to calm
    3: 'happy',      # happy
    4: 'sad',        # sad
    5: 'happy',      # surprise -> often positive
    6: 'neutral'     # neutral
}

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='Akash23112011',
        database='mood_playlist'
    )

def decode_image(base64_string):
    if base64_string.startswith('data:image'):
        base64_string = base64_string.split(',')[1]
    img_data = base64.b64decode(base64_string)
    img = Image.open(BytesIO(img_data))
    return cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)

@app.route('/api/songs/analyze-face', methods=['POST', 'OPTIONS'])
def analyze_face():
    if request.method == 'OPTIONS':
        return jsonify({}), 200

    try:
        data = request.get_json()
        if not data or 'image' not in data:
            print("❌ No image received")
            return jsonify({'error': 'No image provided'}), 400

        img = decode_image(data['image'])
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

        if len(faces) == 0:
            print("⚠️ No face detected")
            return jsonify({'error': 'No face detected'}), 400

        (x, y, w, h) = faces[0]
        face_region = gray[y:y+h, x:x+w]
        face_region = cv2.resize(face_region, (64, 64))
        face_region = face_region / 255.0
        face_region = np.reshape(face_region, (1, 64, 64, 1))

        emotion = model.predict(face_region)
        emotion_label = np.argmax(emotion, axis=1)[0]
        mood = mood_mapping.get(emotion_label, 'neutral')

        print(f"🎯 Detected emotion label: {emotion_label}")
        print(f"🎭 Mapped mood: {mood}")

        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM song WHERE LOWER(mood) = %s ORDER BY RAND() LIMIT 1", (mood,))
        song = cursor.fetchone()
        cursor.close()
        connection.close()

        if not song:
            print(f"❗ No song found for mood: {mood}")
            return jsonify({'mood': mood, 'warning': 'No song found for this mood'}), 200

        print("✅ Song fetched from DB:", song)

        # Rename 'url' to 'link' if needed
        if 'url' in song:
            song['link'] = song.pop('url')
        elif 'link' not in song:
            song['link'] = ''

        print(f"🔗 Final song link: {song['link']}")

        return jsonify({'mood': mood, 'song': song})

    except Exception as e:
        print("🔥 Exception occurred:", str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)