from flask import Flask, request, jsonify
from src.QrAdd import generate_qr, insert_tool

from flask_cors import CORS
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True

#! Endpoint para obtener todas las MOVIES
@app.route('/generate_qr', methods=['GET'])
def gen_qr():
    response = generate_qr()
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

#! Endpoint para registrar herramientas
@app.route('/tool', methods=['POST'])
def add_tool():
    resprev = insert_tool(request)
    resprev.headers.add('Access-Control-Allow-Origin', '*')
    return resprev

if __name__ == '__main__':
    app.run()