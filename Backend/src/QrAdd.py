import mysql.connector
from flask import jsonify
import qrcode
import os
import io
import json

def generate_qr(no_serie):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data('http://34.207.166.97:5173/tool-details/'+no_serie)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")

    # Use io.BytesIO to store the image in memory
    img_bytes = io.BytesIO()
    img.save(img_bytes, format="PNG")  # Specify the format explicitly
    qr_blob = img_bytes.getvalue()


    # Asegurar que el directorio existe
    qr_directory = os.path.join("Backend", "src", "qr")
    os.makedirs(qr_directory, exist_ok=True)

    img_path = os.path.join(qr_directory, f"{no_serie}.png")
    img.save(img_path)
    print(f"QR guardado en {img_path}")

    return no_serie, qr_blob

def insert_tool(request):
    # Parsear data
    data = request.form
    file = request.files["photo"]  # Capturar la imagen
    photo_blob = file.read()  # Convertir la imagen en BLOB

    # Capturar datos
    name = data['name']
    model = data['model']
    no_serie = data['no_serie']
    own = data['own']
    manteni = data['manteni']
    # photo = data['photo']
   

    print(f"Datos recibidos: {name}, {model}, {no_serie}, {own}, {manteni}")
    #* █████████████████████ CONNECT WITH DATABASE:█████████████████████
    try:
        conection = mysql.connector.connect(
            host="db-epost-fcjys-solicitudes.c4nomdu94wi7.us-east-1.rds.amazonaws.com",
            user="integracion",
            password="f5h6e8d5",
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
        INSERT INTO tools (name, model, no_serie, own, manteni, qr, qr_image, photo)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''
    qr, qr_blob = generate_qr(no_serie)
    valores = (name, model, no_serie, own, manteni, qr, qr_blob, photo_blob)

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
