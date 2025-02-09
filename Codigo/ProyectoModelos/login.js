document.getElementById("loginForm").addEventListener("submit", function (event) {
    let correo = document.getElementById("email").value;
    let contraseña = document.getElementById("password").value;
    const errorAlert = document.getElementById("errorAlert");

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
                errorAlert.style.display = "block";
            }
        })
        .catch(error => console.error("Error:", error));
});