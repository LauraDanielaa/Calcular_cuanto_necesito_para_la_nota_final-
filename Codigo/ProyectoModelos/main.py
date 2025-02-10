from http.client import HTTPException
from pyswip import Prolog
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_cors import CORS

prolog = Prolog()
prolog.consult('calculos.pl')
app = Flask(__name__)
CORS(app)

@app.route('/')
def inicio():
    return render_template('iniciar_sesion.html') 
    
def validarNotas(notas):
    notas=notas[:]
    try:
        for i in notas:
            nota=i[0]
            porcentaje=i[1]/100
            query = f"validar_porcentajes({nota}, {porcentaje})"
            list(prolog.query(query))
        return True
    except Exception as e:
        return False
    
@app.route("/recibirNotas", methods=["POST"])
def recibirNotas():
    datos = request.get_json()
    notas=datos["datos"]
    if validarNotas(notas):
        Resultado=calcularNotas(notas)
        return jsonify({"mensaje": Resultado})
    else:
        return jsonify({"mensaje": "error"})

@app.route("/iniciarSesion", methods=["POST"])
def iniciarSesion():
    datos = request.get_json()
    correo = datos["correo"]
    contraseña=str(datos["contraseña"])
    try:
        # Comprobamos si el docente ya existe para evitar duplicados
        consulta = f"estudiante(_, _, '{correo}', {contraseña})"
        existe = list(prolog.query(consulta))
        if existe:
            return jsonify({"status": "success", "redirect_url": "./index.html"})
        else:
            return jsonify({"status": "error"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.route("/registro", methods=["POST"])
def registro():
    datos = request.get_json()
    nombre = datos["nombre"]
    apellido = datos["apellido"]
    correo = datos["correo"]
    contraseña=datos["contraseña"]
    try:
        # Comprobamos si el docente ya existe para evitar duplicados
        consulta = f"estudiante({nombre}, {apellido}, '{correo}', {contraseña})"
        existe = list(prolog.query(consulta))
        if existe:
            return jsonify({"status": "error", "mensaje":"El estudiante ya esta registrado"})
        else:
            comando = f"assertz(estudiante({nombre}, {apellido},'{correo}',{contraseña}))"
            list(prolog.query(comando))
            return jsonify({"status": "success", "redirect_url": "./iniciarSesion.html"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


    
def calcularNotas(notas):
    nota=[]
    porcentajes=[]
    for i in notas:
        nota.append(i[0])
        porcentajes.append(i[1]/100)
    notas_prolog = str(nota).replace('[', '[').replace(']', ']')
    porcentajes_prolog = str(porcentajes).replace('[', '[').replace(']', ']')
    
    query = f"evaluar_notas({notas_prolog}, {porcentajes_prolog}, Resultado)."
    
    try:
        resultado = list(prolog.query(query))
        return f"{resultado[0]['Resultado']}"

    except Exception as e:
        print(e)
        
#calcularNotas([[5, 0.3],[5, 0.5],[5, 0.1]])

@app.route('/index')
def index():
    return render_template('index.html') 

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    
