document.getElementById("miFormulario").addEventListener("submit", function (event) {
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let correo = document.getElementById("email").value;
    let contraseña = document.getElementById("password").value;
    event.preventDefault(); 
    fetch("http://localhost:5000/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre:nombre, apellido:apellido, correo:correo, contraseña:contraseña })
      })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = data.redirect_url;
            } else {
                event.preventDefault();
                let modal = new bootstrap.Modal(document.getElementById("notaModal"));
                modal.show();
                document.getElementById("miFormulario").reset();
            }
        })
        .catch(error => console.error("Error:", error));
});