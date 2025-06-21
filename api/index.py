from flask import Flask, request, jsonify
from pipeline import run_full_pipeline
from database_manager import add_user_app
from database_manager import add_capture  
from database_manager import add_pipeline_output
from database_manager import get_full_analysis_by_url
from database_manager import login_user_app
from werkzeug.security import generate_password_hash
from src.map.map import gerar_mapa_cpted_html

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/run-pipeline', methods=['POST'])
def run_pipeline():
    data = request.get_json()
    url = data.get('image_url')
    result = run_full_pipeline(url)
    return jsonify(result)

# login route

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    nome = data.get('nome')
    cpf = data.get('cpf')
    email = data.get('email')
    senha = data.get('senha')

    if not all([nome, cpf, email, senha]):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400
    
    senha_hash = generate_password_hash(senha)

    add_user_app(nome, email, cpf, senha_hash)

    return jsonify({"message": "Usuário cadastrado com sucesso"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')
    if not all([email, senha]):
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    resultado = login_user_app(email, senha)
    if not resultado:
        return jsonify({"error": "Email ou senha inválidos"}), 401
    return jsonify({"message": "Login realizado com sucesso!"}), 200

# Send photo to pipeline
@app.route('/send-photo', methods=['POST'])
def send_photo():
    data = request.get_json()
    user_app_id = data.get('user_app_id')
    image_url = data.get('image_url')
    timestamp = data.get('timestamp')
    lat = data.get('lat')
    long = data.get('long')
    if not all([image_url, lat, long]):
        return jsonify({"error": "Todos os campos são obrigatórios"}), 400

    add_capture(user_app_id, image_url, timestamp, lat, long)

    result = run_full_pipeline(image_url)
    
    add_pipeline_output(1, result)

    return jsonify(result), 200

@app.route('/get-analysis', methods=['GET'])
def get_analysis():
    image_url = request.args.get('image_url')
    if not image_url:
        return jsonify({"error": "URL da imagem é obrigatória"}), 400
    
    result = get_full_analysis_by_url(image_url)
    
    if not result:
        return jsonify({"error": "Análise não encontrada"}), 404
    
    return jsonify(result), 200

@app.route('/   ')
def generate_map():    
    map_html = gerar_mapa_cpted_html()
    
    if not map_html:
        return jsonify({"error": "Nenhum dado encontrado para gerar o mapa"}), 404
    
    return map_html, 200