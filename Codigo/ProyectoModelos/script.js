const img = document.querySelector("#img");

function agregarFila() {
    let tabla = document.getElementById("tablaNotas").getElementsByTagName('tbody')[0];
    let nuevaFila = tabla.insertRow();
    nuevaFila.innerHTML = `
        <td><input type="number" class="form-control nota" min="0" max="5"></td>
        <td><input type="number" class="form-control porcentaje" min="0" max="100"></td>
        <td><button class="btn btn-danger btn-sm" onclick="eliminarFila(this)">Eliminar</button></td>
    `;
}

function eliminarFila(boton) {
    let fila = boton.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}

function calcularNota() {
    let notas = document.querySelectorAll(".nota");
    let porcentajes = document.querySelectorAll(".porcentaje");
    
    // Convertir NodeList a un Array de tuplas (pares de valores)
    let datos = Array.from(notas).map((nota, index) => {
        return [parseFloat(nota.value), parseFloat(porcentajes[index].value)];
    });
    fetch("http://localhost:5000/recibirNotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos:datos })
      })
        .then(response => response.json())
        .then(data => {
            console.log(data.mensaje);
            if (data.mensaje <= 0) {
                resultadoTexto = "¡Felicidades! Ya tienes la nota necesaria para aprobar.";
                resultadoClase = "text-success";
                img.src="imagenes/gato_nota_mayor_a_5.png"
            } else if (data.mensaje > 5) {
                resultadoTexto = "Necesitas más de 5.0 para aprobar 😢";
                resultadoClase = "text-danger";
                img.src="imagenes/gato_nota_menor_a_0.png"
            } else {
                resultadoTexto = `Necesitas sacar <strong>${data.mensaje}</strong> en el porcentaje final.`;
                resultadoClase = "text-primary";
                img.src="imagenes/gato_nota_0_a_3.png"
            }

            // Mostrar el resultado en el modal
            let resultadoModal = document.getElementById("resultadoModal");
            resultadoModal.innerHTML = resultadoTexto;
            resultadoModal.className = resultadoClase;

            // Abrir el modal
            let modal = new bootstrap.Modal(document.getElementById("notaModal"));
            modal.show();
        })
        .catch(error => console.error("Error:", error));
    
}

