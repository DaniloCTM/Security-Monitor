from flask import Flask, request, jsonify
from pipeline import run_full_pipeline
from database_manager import add_user_app
from database_manager import find_user_by_email
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

@app.route('/')
def home():
    return 'Hello, World!'

@app.route('/add_user')
def add_user():
    add_user_app("João Silva", "joãoexample@gmail", "12345678901", "password")
    return 'User added successfully!'

@app.route('/check_user')
def check_user():
    data = find_user_by_email("joãoexample@gmail")
    return data if data else 'User not found!'

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

    # Criptografar a senha
    senha_hash = generate_password_hash(senha)

    user = {
        "nome": nome,
        "cpf": cpf,
        "email": email,
        "senha": senha_hash
    }

    return jsonify({"message": "Usuário cadastrado com sucesso"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('senha')

    #conn = get_db_connection()
    #cursor = conn.cursor(dictionary=True)

    #cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    #user = cursor.fetchone()

    #cursor.close()
    #conn.close()

    #if user and check_password_hash(user['senha_hash'], senha):
    return jsonify({"message": "Login realizado com sucesso!"}), 200
    #else:
    #    return jsonify({"error": "Email ou senha inválidos"}), 401