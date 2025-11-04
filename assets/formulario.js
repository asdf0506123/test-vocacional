const form = document.getElementById("registro");
const submitButton = document.getElementById("registrar-btn");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    const formData = new FormData(this);
    const formDataObj = {};

    // Recopilar datos del formulario
    for (let [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }

    // GUARDAR DATOS EN SESSIONSTORAGE para usar en el test vocacional
    sessionStorage.setItem('datosRegistro', JSON.stringify({
      nombre: formDataObj.Nombre,
      edad: formDataObj.Edad,
      email: formDataObj.Email,
      telefono: formDataObj.Teléfono
    }));

    console.log('✅ Datos de registro guardados temporalmente');

  } catch (error) {
    console.error("Error:", error);
    alert("Error: " + error.message);
  
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Registrarse";
  }
});