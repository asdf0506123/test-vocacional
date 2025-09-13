// Variables globales
let campusSeleccionado = '';
let turnoSeleccionado = '';
let preguntaActual = 0;
let respuestasUsuario = {};
let preguntasFiltradas = [];

// Datos del formulario
const startForm = document.getElementById("start-form");
const testForm = document.getElementById("test-form");
const resultsDiv = document.getElementById("results");

// Definición de carreras por campus
const carrerasPorCampus = {
  'Campeche': [
    "Administracion de empresas", 
    "Comunicacion", 
    "Pedagogia", 
    "Artes culinarias", 
    "Derecho", 
    "Contaduria", 
    "Programacion/Webmaster", 
    "Sistemas computacionales"
  ],
  'Escarcega': [
    "Administracion de empresas", 
    "Pedagogia", 
    "Derecho", 
    "Contaduria"
  ]
};

const todasLasPreguntas = [
  { 
    id: 1,
    texto: "Me gusta cuando las cosas funcionan de manera ordenada en un grupo.",
    carreras: ["Administracion de empresas", "Comunicacion"] 
  },
  { 
    id: 2,
    texto: "Disfruto cuando alguien entiende mejor algo gracias a mí.",
    carreras: ["Pedagogia"] 
  },
  { 
    id: 3,
    texto: "Me emociona probar sabores nuevos y combinar ingredientes.",
    carreras: ["Artes culinarias"] 
  },
  { 
    id: 4,
    texto: "Me interesa comprender cómo funcionan las reglas en la sociedad.",
    carreras: ["Derecho"] 
  },
  { 
    id: 5,
    texto: "Me resulta interesante manejar presupuestos o balances.",
    carreras: ["Contaduria", "Administracion de empresas"] 
  },
  { 
    id: 6,
    texto: "Me gusta imaginar cómo sería crear una herramienta digital.",
    carreras: ["Programacion/Webmaster", "Sistemas computacionales"] 
  },
  { 
    id: 7,
    texto: "No me incomoda hablar frente a varias personas.",
    carreras: ["Comunicacion", "Derecho"] 
  },
  { 
    id: 8,
    texto: "Siento curiosidad por descubrir por qué algo falla y arreglarlo.",
    carreras: ["Sistemas computacionales", "Programacion/Webmaster"] 
  },
  { 
    id: 9,
    texto: "Me gusta acompañar a las personas a encontrar una solución a sus dudas.",
    carreras: ["Pedagogia", "Administracion de empresas"] 
  },
  { 
    id: 10,
    texto: "Me siento en mi ambiente cuando estoy en una cocina.",
    carreras: ["Artes culinarias"] 
  }
];

// Función para filtrar preguntas según el campus
function filtrarPreguntasPorCampus(campus) {
  const carrerasDisponibles = carrerasPorCampus[campus] || [];
  
  return todasLasPreguntas.filter(pregunta => {
    return pregunta.carreras.some(carrera => carrerasDisponibles.includes(carrera));
  });
}

// Función para mostrar una pregunta específica
function mostrarPregunta(indicePregunta) {
  const pregunta = preguntasFiltradas[indicePregunta];
  if (!pregunta) return;

  const testFormContent = `
    <div class="pregunta-container">
      <div class="pregunta-header">
        <h3>Pregunta ${indicePregunta + 1} de ${preguntasFiltradas.length}</h3>
        <div class="progress-bar-container">
          <div class="progress">
            <div class="progress-fill" style="width: ${((indicePregunta + 1) / preguntasFiltradas.length) * 100}%"></div>
          </div>
        </div>
      </div>
      
      <div class="pregunta">
        <p><strong>${pregunta.texto}</strong></p>
        <div class="opciones-respuesta">
          <label class="opcion-radio">
            <input type="radio" name="pregunta_${pregunta.id}" value="1" ${respuestasUsuario[pregunta.id] === 1 ? 'checked' : ''}>
            <span class="radio-custom"></span>
            Sí
          </label>
          <label class="opcion-radio">
            <input type="radio" name="pregunta_${pregunta.id}" value="0" ${respuestasUsuario[pregunta.id] === 0 ? 'checked' : ''}>
            <span class="radio-custom"></span>
            No
          </label>
        </div>
      </div>
      
      <div class="navegacion-botones">
        <button type="button" id="btn-anterior" class="btn btn-secondary" ${indicePregunta === 0 ? 'disabled' : ''}>
          ← Anterior
        </button>
      </div>
    </div>
  `;

  testForm.innerHTML = testFormContent;

  // Agregar event listeners para las respuestas (avance automático)
  const radios = testForm.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => {
    radio.addEventListener('change', function() {
      respuestasUsuario[pregunta.id] = parseInt(this.value);
      
      // Esperar un momento para mostrar la selección y luego avanzar automáticamente
      setTimeout(() => {
        if (preguntaActual < preguntasFiltradas.length - 1) {
          preguntaActual++;
          mostrarPregunta(preguntaActual);
        } else {
          // Es la última pregunta, mostrar resultados
          mostrarResultados();
        }
      }, 500); // 500ms de delay para que el usuario vea su selección
    });
  });

  // Event listener para botón anterior
  const btnAnterior = document.getElementById('btn-anterior');
  if (btnAnterior && !btnAnterior.disabled) {
    btnAnterior.addEventListener('click', function() {
      if (preguntaActual > 0) {
        preguntaActual--;
        mostrarPregunta(preguntaActual);
      }
    });
  }
}

// Función para calcular y mostrar resultados
async function mostrarResultados() {
  const carrerasDisponibles = carrerasPorCampus[campusSeleccionado];
  const puntajes = {};

  // Inicializar puntajes
  carrerasDisponibles.forEach(carrera => {
    puntajes[carrera] = 0;
  });

  // Calcular puntajes basado en las respuestas
  preguntasFiltradas.forEach(pregunta => {
    const respuesta = respuestasUsuario[pregunta.id];
    if (respuesta === 1) {
      pregunta.carreras.forEach(carrera => {
        if (puntajes.hasOwnProperty(carrera)) {
          puntajes[carrera]++;
        }
      });
    }
  });

  // Convertir a array y ordenar por puntaje (solo top 3)
  const resultadosOrdenados = Object.entries(puntajes)
    .map(([carrera, puntaje]) => ({
      carrera,
      puntaje,
      porcentaje: Math.round((puntaje / preguntasFiltradas.length) * 100)
    }))
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, 3); // Solo los top 3

  // OBTENER DATOS DE REGISTRO DESDE SESSIONSTORAGE
  const datosRegistro = JSON.parse(sessionStorage.getItem('datosRegistro') || '{}');
  console.log('Datos de registro recuperados:', datosRegistro);

// Convertir resultados a string plano, solo top 3
const resultadosTop3 = resultadosOrdenados
  .slice(0, 3)
  .map(r => r && r.carrera ? r.carrera.toString() : "N/A");

const datosCompletos = {
  tipo: 'testVocacional',
  nombre: datosRegistro.nombre || 'No especificado',
  edad: datosRegistro.edad || 'No especificado', 
  email: datosRegistro.email || 'No especificado',
  telefono: datosRegistro.telefono || 'No especificado',
  campus: campusSeleccionado,
  turno: turnoSeleccionado,
  resultados: resultadosTop3.join(", "), // 🔥 AQUI ya es UN STRING
  fecha: new Date().toLocaleString()
};



  // Enviar TODOS los datos JUNTOS a Google Sheets
  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbz1ulYy0Gd9o8Sap19XFBCK0i3Sxyz89IkDo6B-Xvbv6RgN2KcMrYmEEhiECiXGxJsA/exec";
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(datosCompletos),
      headers: {"Content-Type": "text/plain;charset=utf-8"}
    });
    const data = await response.json();
    if (data.status === "success") {
      console.log("✅ Datos completos guardados en Sheets");
      // Limpiar sessionStorage después de guardar exitosamente
      sessionStorage.removeItem('datosRegistro');
    }
  } catch (err) {
    console.error("Error al enviar a Sheets:", err);
  }

  // Función para obtener icono de carrera
  function obtenerIconoCarrera(carrera) {
    const iconos = {
      'Administracion de empresas': 'src/img/administracion.png',
      'Comunicacion': 'src/img/comunicacion.png',
      'Pedagogia': 'src/img/pedagogia.png',
      'Artes culinarias': 'src/img/artes.png',
      'Derecho':'src/img/derecho.png',
      'Contaduria': 'src/img/contaduria.png',
      'Programacion/Webmaster': 'src/img/programacion.png',
      'Sistemas computacionales': 'src/img/sistemas.png'
    };
    return iconos[carrera] || 'src/img/default.png';
  }

  // Generar HTML de resultados (solo top 3)
  let resultadosHTML = `
    <div class="card">
      <h2>Tus Top 3 Carreras Recomendadas</h2>
      <p><strong>Campus:</strong> ${campusSeleccionado}</p>
      <p><strong>Estudiante:</strong> ${datosRegistro.nombre || 'No especificado'}</p>
      <hr>
      <div class="top-results">
  `;

  resultadosOrdenados.forEach((resultado, index) => {
    const iconSrc = obtenerIconoCarrera(resultado.carrera);
    const medallaColor = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    const radius = 28;
    const stroke = 6;
    const normalizedPercent = Math.max(0, Math.min(resultado.porcentaje, 100));
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - normalizedPercent / 100);
    const color = obtenerColorPorRanking(index);
    
    resultadosHTML += `
      <div class="career-result top-${index + 1}">
        <div class="ranking-medal">${medallaColor}</div>
        <div class="career-info">
          <div class="career-icon">
            <img src="${iconSrc}" alt="${resultado.carrera}" />
          </div>
          <div class="career-title">${resultado.carrera}</div>
          <div class="progress-circle">
            <svg width="64" height="64">
              <circle class="circle-bg" cx="32" cy="32" r="${radius}" stroke="#e3e8f0" stroke-width="${stroke}" fill="none" />
              <circle class="circle" cx="32" cy="32" r="${radius}" stroke="${color}" stroke-width="${stroke}" fill="none" 
                     stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" />
              <text x="32" y="38" text-anchor="middle" font-size="18" fill="#13235B" font-family="Segoe UI, Arial, sans-serif">${resultado.porcentaje}%</text>
            </svg>
          </div>
        </div>
      </div>
    `;
  });

  resultadosHTML += `
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; margin-bottom: 20px;">
          <em>Estos resultados se basan en tus respuestas y han sido guardados para seguimiento académico.</em>
        </p>
        <button type="button" id="btn-reiniciar" class="btn">Realizar Test Nuevamente</button>
      </div>
    </div>
  `;

  testForm.classList.add('hidden');
  resultsDiv.innerHTML = resultadosHTML;
  resultsDiv.classList.remove('hidden');

  // Event listener para reiniciar
  document.getElementById('btn-reiniciar').addEventListener('click', function() {
    // Limpiar sessionStorage y regresar al inicio
    sessionStorage.removeItem('datosRegistro');
    window.location.href = 'index.html';
  });
}

// Función para obtener color según ranking (oro, plata, bronce)
function obtenerColorPorRanking(index) {
  const colores = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Oro, Plata, Bronce
  return colores[index] || "#9E9E9E";
}

// Event listener para el formulario de inicio
if (startForm) {
  startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    campusSeleccionado = document.getElementById('campus').value;
    turnoSeleccionado = document.getElementById('turno').value;
    
    console.log('Campus seleccionado:', campusSeleccionado);
    console.log('Turno seleccionado:', turnoSeleccionado);
    
    if (!campusSeleccionado || !turnoSeleccionado) {
      alert('Por favor selecciona una entidad y un horario');
      return;
    }

    // Filtrar preguntas según el campus
    preguntasFiltradas = filtrarPreguntasPorCampus(campusSeleccionado);
    console.log('Preguntas filtradas:', preguntasFiltradas.length);
    
    if (preguntasFiltradas.length === 0) {
      alert('No hay preguntas disponibles para el campus seleccionado');
      return;
    }
    
    // Ocultar formulario de inicio y mostrar test
    startForm.classList.add('hidden');
    testForm.classList.remove('hidden');
    
    // Limpiar resultados previos
    if (resultsDiv) {
      resultsDiv.innerHTML = '';
      resultsDiv.classList.add('hidden');
    }
    
    // Inicializar variables
    preguntaActual = 0;
    respuestasUsuario = {};
    
    // Mostrar primera pregunta
    mostrarPregunta(preguntaActual);
  });
}

// Debug: Verificar que los elementos existen
console.log('StartForm:', startForm);
console.log('TestForm:', testForm);
console.log('ResultsDiv:', resultsDiv);