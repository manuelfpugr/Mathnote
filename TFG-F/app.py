from flask import Flask, request, jsonify
import whisper
import os

app = Flask(__name__)
model = whisper.load_model("medium")

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    temp_audio_file = "temp_audio.wav"
    file.save(temp_audio_file)

    try:
        result = model.transcribe(temp_audio_file)
        transcription = result["text"]
        return jsonify({'text': transcription})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(temp_audio_file):
            os.remove(temp_audio_file)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)