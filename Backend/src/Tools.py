import mysql.connector
from flask import jsonify
import qrcode
import os
import json

def toolsget(request):
    # Parsear data
    data = request.get_json()
    print(data)

    # Capturar datos
    idusuario = data['idusuario']

    print(f"Datos recibidos: {idusuario}")
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
        SELECT * FROM tools WHERE own = %s'''
    valores = (idusuario)
    print(valores)
    print(sql)
    toolsgetted = ''
    try:
        cursor.execute(sql, valores)
        # obtener las herramientas
        toolsgetted = cursor.fetchall()

    except mysql.connector.Error as error:
        print(f"Error al insertar en la base de datos: {error}")
        conection.rollback()
        toolsgetted = None

    cursor.close()
    conection.close()
    
    if toolsgetted:
        return jsonify({"res": True, "tools": toolsgetted})
    else:
        return jsonify({"res": False, "message": "Credenciales inválidas"}), 401
