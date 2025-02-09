import mysql.connector
from flask import jsonify
import qrcode
import os
import json
import jwt
import datetime

SECRET_KEY = "supersecretkey"  # Cambia esto a un valor seguro

def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Expira en 1 hora
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token

def register(request):
    # Parsear data
    data = request.get_json()
    print(data)

    # Capturar datos
    username = data['username']
    password = data['password']
    # photo = data['photo']
   

    print(f"Datos recibidos: {username}, {password}")
    #* █████████████████████ CONNECT WITH DATABASE:█████████████████████
    try:
        conection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="marketingcourse"
        )
        print("Conexión establecida correctamente.")

    except mysql.connector.Error as error:
        # Retornar error en caso de no poder conectarse
        print(f"No se pudo conectar a la base de datos: {error}")
        return {
            "res": False,
        }
    
    # Crear un cursor para interactuar con la base de datos
    cursor = conection.cursor()

    # Preparar la consulta para insertar una herramienta
    sql = '''
        INSERT INTO users (user, pass)
        VALUES (%s, %s)'''
    valores = (username, password)

    
    try:
        cursor.execute(sql, valores)
        conection.commit()
        res_id = cursor.lastrowid  # Obtener el ID insertado
    except mysql.connector.Error as error:
        print(f"Error al insertar en la base de datos: {error}")
        conection.rollback()
        res_id = None

    cursor.close()
    conection.close()
    
    return jsonify({"res": res_id})

def login(request):
    # Parsear data
    data = request.get_json()
    print(data)

    # Capturar datos
    username = data['username']
    password = data['password']
    # photo = data['photo']
   

    print(f"Datos recibidos: {username}, {password}")
    #* █████████████████████ CONNECT WITH DATABASE:█████████████████████
    try:
        conection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="marketingcourse"
        )
        print("Conexión establecida correctamente.")

    except mysql.connector.Error as error:
        # Retornar error en caso de no poder conectarse
        print(f"No se pudo conectar a la base de datos: {error}")
        return {
            "res": False,
        }
    
    # Crear un cursor para interactuar con la base de datos
    cursor = conection.cursor(dictionary=True)

    # Preparar la consulta para insertar una herramienta
    sql = '''
        SELECT * FROM users WHERE user = %s AND pass = %s'''
    valores = (username, password)
    print(valores)
    print(sql)
    token = ''
    try:
        cursor.execute(sql, valores)
        res_id = cursor.fetchone()

    except mysql.connector.Error as error:
        print(f"Error al insertar en la base de datos: {error}")
        conection.rollback()
        res_id = None

    cursor.close()
    conection.close()
    
    if res_id:
        token = generate_token(res_id["id"])  # Generar token con el ID del usuario
        print(f"Token generado: {token}")
        return jsonify({"res": True, "token": token})
    else:
        return jsonify({"res": False, "message": "Credenciales inválidas"}), 401