document.getElementById("loginForm").addEventListener("submit", function (event) {
    let correo = document.getElementById("email").value;
    let contraseña = document.getElementById("password").value;
    let errorEmail = document.getElementById("error-email");
    let errorPassword = document.getElementById("error-password");

    event.preventDefault(); 
    fetch("http://localhost:5000/iniciarSesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo:correo, contraseña:contraseña })
      })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                window.location.href = data.redirect_url; // Redirige a index.html
            } else {
                mensaje.textContent = data.mensaje; // Muestra el mensaje de error
                mensaje.style.color = "red";
            }
        })
        .catch(error => console.error("Error:", error));

    
    errorEmail.textContent = "";
    errorPassword.textContent = "";
});