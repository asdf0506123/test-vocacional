AOS.init();

const startForm = document.getElementById("start-form");
const testForm = document.getElementById("test-form");
const registro = document.getElementById("registro");

registro.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevenir el envío normal del formulario
  
  // Validar que todos los campos requeridos estén llenos
  if (!validarFormulario()) {
    return; // Detener la ejecución si la validación falla
  }
  
  registro.classList.add("hidden");
  registroExitoso();
});

function validarFormulario() {
  // Obtener todos los campos requeridos del formulario
  const camposRequeridos = registro.querySelectorAll('input[required], select[required], textarea[required]');
  
  let formularioValido = true;
  let primerCampoVacio = null;
  
  // Verificar cada campo requerido
  camposRequeridos.forEach(campo => {

    campo.classList.remove('error');
    
    // Verificar si el campo está vacío
    if (!campo.value.trim()) {
      formularioValido = false;
      campo.classList.add('error'); // Agregar clase para estilo visual
      
      // Guardar referencia del primer campo vacío para hacer focus
      if (!primerCampoVacio) {
        primerCampoVacio = campo;
      }
    }
  });
  
// Si hay campos vacíos, mostrar mensaje de error
  if (!formularioValido) {
    // Hacer focus en el primer campo vacío
    if (primerCampoVacio) {
      primerCampoVacio.focus();
    }
  }
  
  return formularioValido;
}

function registroExitoso() {
  Swal.fire({
    icon: 'success',
    title: '¡Registro Exitoso!',
    text: 'Ahora puedes continuar con el test vocacional.',
    confirmButtonText: 'Realizar Test'
  }).then((result) => {
    // Cuando el usuario haga clic en el botón "Realizar Test"
    if (result.isConfirmed) {
      window.location.href = 'testVocacional.html';
    }
  });
}