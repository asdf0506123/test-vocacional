AOS.init();

const startForm = document.getElementById("start-form");
const testForm = document.getElementById("test-form");
const registro = document.getElementById("registro");

registro.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validar que todos los campos requeridos estén llenos
  if (!validarFormulario()) {
    return;
  }

  registro.classList.add("hidden");
  registroExitoso();
});

function validarFormulario() {
  // Obtener todos los campos requeridos del formulario
  const camposRequeridos = registro.querySelectorAll(
    "input[required], select[required], textarea[required]"
  );

  let formularioValido = true;
  let primerCampoVacio = null;

  // Regex para validar teléfono (solo números)
  const phoneRegex = /^[0-9]{10}$/;
  const telefono = registro.querySelector('input[name="Teléfono"]');

  // Validación de edad
  const edad = registro.querySelector('input[name="Edad"]');
  const edadValue = parseInt(edad.value);

  // Regex para validar nombre (letras, espacios, acentos y ñ)
  const nombreRegex = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,100}$/;
  const nombre = registro.querySelector('input[name="Nombre"]');

  // Verificar cada campo requerido
  camposRequeridos.forEach((campo) => {
    campo.classList.remove("error");

    // Validación para el nombre
    if (campo === nombre) {
      const nombreValue = campo.value.trim();
      const palabras = nombreValue
        .split(/\s+/)
        .filter((word) => word.length > 0);

      if (
        !nombreRegex.test(nombreValue) ||
        palabras.length > 5 ||
        palabras.length < 1
      ) {
        formularioValido = false;
        campo.classList.add("error");
        if (!primerCampoVacio) primerCampoVacio = campo;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingresa un nombre válido",
        });
        return;
      }
    }
    // Validación para el teléfono
    else if (campo === telefono) {
      if (!phoneRegex.test(campo.value.trim())) {
        formularioValido = false;
        campo.classList.add("error");
        if (!primerCampoVacio) primerCampoVacio = campo;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingresa un número telefónico válido de 10 dígitos",
        });
        return;
      }
    }
    // Validación para la edad
    else if (campo === edad) {
      if (isNaN(edadValue) || edadValue < 10 || edadValue > 100) {
        formularioValido = false;
        campo.classList.add("error");
        if (!primerCampoVacio) primerCampoVacio = campo;
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Por favor ingresa una edad válida entre 10 y 100 años",
        });
        return;
      }
    }
    // Verificar si el campo está vacío
    else if (!campo.value.trim()) {
      formularioValido = false;
      campo.classList.add("error");
      if (!primerCampoVacio) {
        primerCampoVacio = campo;
      }
    }
  });

  // Si hay campos vacíos, mostrar mensaje de error
  if (!formularioValido) {
    if (primerCampoVacio) {
      primerCampoVacio.focus();
    }
  }

  return formularioValido;
}

function registroExitoso() {
  Swal.fire({
    icon: "success",
    title: "¡Registro Exitoso!",
    text: "Ahora puedes continuar con el test vocacional.",
    confirmButtonText: "Realizar Test",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "testVocacional.html";
    }
  });
}
