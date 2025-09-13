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

  // Preparar datos para Google Sheets
  const topCarrerasParaSheets = resultadosOrdenados.map(r => r.carrera);
  const datos = {
    campus: campusSeleccionado,
    turno: turnoSeleccionado,
    resultado: topCarrerasParaSheets.join(", "),
    fecha: new Date().toLocaleString()
  };

  // Enviar a Google Sheets
  try {
    const scriptURL = "https://script.google.com/macros/s/AKfycbz1ulYy0Gd9o8Sap19XFBCK0i3Sxyz89IkDo6B-Xvbv6RgN2KcMrYmEEhiECiXGxJsA/exec";
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(datos),
      headers: {"Content-Type": "text/plain;charset=utf-8"}
    });
    const data = await response.json();
    if (data.status === "success") {
      console.log("Todo guardado en Sheets ✅");
    }
  } catch (err) {
    console.error("Error al enviar a Sheets:", err);
  }

  // Función para obtener icono de carrera
function obtenerIconoCarrera(carrera) {
  const iconos = {
    'Administracion de empresas': '../src/img/administracion.png',
    'Comunicacion': '../src/img/comunicacion.png',
    'Pedagogia': '../src/img/pedagogia.png',
    'Artes culinarias': '../src/img/artes.png',
    'Derecho':'../src/img/derecho.png',
    'Contaduria': '../src/img/contaduria.png',
    'Programacion/Webmaster': '../src/img/programacion.png',
    'Sistemas computacionales': '../src/img/sistemas.png'
  };
  return `<span style="font-size: 32px;">${iconos[carrera] || "🎓"}</span>`;
}

  // Generar HTML de resultados (solo top 3)
  let resultadosHTML = `
    <div class="card">
      <h2>Tus Top 3 Carreras Recomendadas</h2>
      <p><strong>Campus:</strong> ${campusSeleccionado}</p>
      <hr>
      <div class="top-results">
  `;

  resultadosOrdenados.forEach((resultado, index) => {
    const iconoCarrera = obtenerIconoCarrera(resultado.carrera);
    const medallaColor = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    
    resultadosHTML += `
      <div class="career-result top-${index + 1}">
        <div class="ranking-medal">${medallaColor}</div>
        <div class="career-icon">
          ${iconoCarrera}
        </div>
        <div class="career-info">
          <div class="career-title">${resultado.carrera}</div>
          <div class="career-subtitle">Posición #${index + 1}</div>
          <div class="progress-circle">
            <svg viewBox="0 0 100 100">
              <circle class="circle-bg" cx="50" cy="50" r="40" fill="none" stroke-width="10"></circle>
              <circle class="circle" cx="50" cy="50" r="40" fill="none" 
                     stroke="${obtenerColorPorRanking(index)}"
                     stroke-dasharray="251.2"
                     stroke-dashoffset="${251.2 - (251.2 * resultado.porcentaje / 100)}"></circle>
              <text x="50" y="50" text-anchor="middle">${resultado.porcentaje}%</text>
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
    location.reload();
  });
}


// Función para obtener color según ranking (oro, plata, bronce)
function obtenerColorPorRanking(index) {
  const colores = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Oro, Plata, Bronce
  return colores[index] || "#9E9E9E";
}

// Event listener para el formulario de inicio
startForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  campusSeleccionado = document.getElementById('campus').value;
  turnoSeleccionado = document.getElementById('turno').value;
  
  if (!campusSeleccionado || !turnoSeleccionado) {
    alert('Por favor selecciona una entidad y un horario');
    return;
  }

  // Filtrar preguntas según el campus
  preguntasFiltradas = filtrarPreguntasPorCampus(campusSeleccionado);
  
  // Ocultar formulario de inicio y mostrar test
  startForm.classList.add('hidden');
  testForm.classList.remove('hidden');
  
  // Inicializar variables
  preguntaActual = 0;
  respuestasUsuario = {};
  
  // Mostrar primera pregunta
  mostrarPregunta(preguntaActual);
});
