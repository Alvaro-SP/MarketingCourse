from flask import Flask, request, jsonify
from src.QrAdd import insert_tool
from src.Tools import toolsget
from src.User import register, login

from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True

#! Endpoint para obtener todas las MOVIES
@app.route('/tools', methods=['POST'])
def get_tools():
    response = toolsget(request)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#! Endpoint para registrar herramientas
@app.route('/tool', methods=['POST'])
def add_tool():
    resprev = insert_tool(request)
    resprev.headers.add('Access-Control-Allow-Origin', '*')
    return resprev

#! Endpoint para registrar usuario
@app.route('/register', methods=['POST'])
def retister_user():
    resprev = register(request)
    resprev.headers.add('Access-Control-Allow-Origin', '*')
    return resprev

#! Endpoint para loggear usuario
@app.route('/login', methods=['POST'])
def login_user():
    resprev = login(request)
    resprev.headers.add('Access-Control-Allow-Origin', '*')
    return resprev

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)