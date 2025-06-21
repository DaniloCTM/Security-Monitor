from flask import Flask, request, jsonify
from pipeline import run_full_pipeline  # Certifique-se de que pipeline.py está no mesmo diretório ou no PYTHONPATH

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/about')
def about():
    return 'About'

@app.route('/run-pipeline', methods=['POST'])
def run_pipeline():
    data = request.get_json()
    url = data.get('image_url')
    result = run_full_pipeline(url)
    return jsonify(result)