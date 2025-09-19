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
    "Administración de empresas", 
    "Comunicación", 
    "Pedagogía", 
    "Artes culinarias", 
    "Derecho", 
    "Contaduría", 
    "Programación", 
    "Sistemas computacionales"
  ],
  'Escarcega': [
    "Administración de empresas", 
    "Pedagogía", 
    "Derecho", 
    "Contaduría"
  ]
};

// Información detallada de cada carrera
const informacionCarreras = {
  'Administración de empresas': {
    descripcion: 'Forma líderes capaces de dirigir organizaciones, tomar decisiones estratégicas y gestionar recursos humanos y financieros de manera eficiente.',
    pdf: 'src/planes/Administración.jpg'
  },
  'Comunicación': {
    descripcion: 'Desarrolla profesionales en medios, marketing digital, relaciones públicas y creación de contenido para diversas plataformas.',
    pdf: 'src/planes/Comunicación.jpg'
  },
  'Pedagogía': {
    descripcion: 'Prepara educadores comprometidos con la formación integral, diseño curricular y metodologías innovadoras de enseñanza-aprendizaje.',
    pdf: 'src/planes/Pedagogía.jpg'
  },
  'Artes culinarias': {
    descripcion: 'Forma chefs profesionales con técnicas gastronómicas avanzadas, administración de cocina y creación de experiencias culinarias únicas.',
    pdf: 'src/planes/artes.jpg'
  },
  'Derecho': {
    descripcion: 'Prepara juristas íntegros con sólidos conocimientos legales para ejercer en diversas áreas del derecho y la justicia.',
    pdf: 'src/planes/derecho.jpg'
  },
  'Contaduría': {
    descripcion: 'Desarrolla expertos en finanzas, auditoría, fiscalización y análisis contable para la toma de decisiones empresariales.',
    pdf: 'src/planes/Contaduría.jpg'
  },
  'Programación': {
    descripcion: 'Forma desarrolladores web especializados en programación, diseño de interfaces y gestión de proyectos digitales.',
    pdf: 'src/planes/Programación.jpg'
  },
  'Sistemas computacionales': {
    descripcion: 'Prepara ingenieros en sistemas capaces de desarrollar software, administrar redes y solucionar problemas tecnológicos complejos.',
    pdf: 'src/planes/sistemas.jpg'
  }
};

const todasLasPreguntas = [
  { 
    id: 1,
    texto: "Me gusta cuando las cosas funcionan de manera ordenada en un grupo.",
    carreras: ["Administración de empresas", "Comunicación"] 
  },
  { 
    id: 2,
    texto: "Disfruto cuando alguien entiende mejor algo gracias a mí.",
    carreras: ["Pedagogía"] 
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
    carreras: ["Contaduría", "Administración de empresas"] 
  },
  { 
    id: 6,
    texto: "Me gusta imaginar cómo sería crear una herramienta digital.",
    carreras: ["Programación", "Sistemas computacionales"] 
  },
  { 
    id: 7,
    texto: "No me incomoda hablar frente a varias personas.",
    carreras: ["Comunicación", "Derecho"] 
  },
  { 
    id: 8,
    texto: "Siento curiosidad por descubrir por qué algo falla y arreglarlo.",
    carreras: ["Sistemas computacionales", "Programación"] 
  },
  { 
    id: 9,
    texto: "Me gusta acompañar a las personas a encontrar una solución a sus dudas.",
    carreras: ["Pedagogía", "Administración de empresas"] 
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
          
          mostrarSweetAlertCalculando();
        }
      }, 500);
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

// Función para mostrar Sweet Alert de "Calculando resultados"
function mostrarSweetAlertCalculando() {
  
  Swal.fire({
    title: "Calculando tus resultados...",
    html: "Procesando y enviando datos...<br><small>Por favor espera mientras guardamos tu información</small>",
    imageUrl: "src/img/seti.gif",
    imageWidth: 300,
    imageHeight: 295,
    imageAlt: "Calculando resultados",
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
      

      mostrarResultados();
    }
  });
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
  resultados: resultadosTop3.join(", "),
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
      'Administración de empresas': 'src/img/Administración.png',
      'Comunicación': 'src/img/Comunicación.png',
      'Pedagogía': 'src/img/Pedagogía.png',
      'Artes culinarias': 'src/img/artes.png',
      'Derecho':'src/img/derecho.png',
      'Contaduría': 'src/img/Contaduría.png',
      'Programación': 'src/img/Programación.png',
      'Sistemas computacionales': 'src/img/sistemas.png'
    };
    return iconos[carrera] || 'src/img/default.png';
  }

  // Generar HTML de resultados (solo top 3)
  let resultadosHTML = `
    <div class="card">
      <h2 style="text-align: center;">Tus Top 3 Carreras Recomendadas</h2>
      <p style="text-align: center;">Este test es solo una orientación vocacional. Para más información o asesoría personalizada, acude al Área de Vinculación.</p>
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
    
    // Obtener información de la carrera
    const infoCarrera = informacionCarreras[resultado.carrera];
    const descripcion = infoCarrera ? infoCarrera.descripcion : 'Descripción no disponible';
    const pdfUrl = infoCarrera ? infoCarrera.pdf : '#';
    
    resultadosHTML += `
      <div class="career-result top-${index + 1}">
        <div class="ranking-medal">${medallaColor}</div>
        
        <!-- Sección superior: Icono, título y porcentaje -->
        <div class="career-header">
          <div class="career-icon">
            <img src="${iconSrc}" alt="${resultado.carrera}" />
          </div>
          <div class="career-title">${resultado.carrera}</div>
          <div class="progress-circle">
            <svg width="60" height="60">
              <circle class="circle-bg" cx="30" cy="30" r="${radius}" stroke="#e3e8f0" stroke-width="${stroke}" fill="none" />
              <circle class="circle" cx="30" cy="30" r="${radius}" stroke="${color}" stroke-width="${stroke}" fill="none" 
                     stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" stroke-linecap="round" />
              <text x="30" y="36" text-anchor="middle" font-size="16" fill="#13235B" font-family="Segoe UI, Arial, sans-serif">${resultado.porcentaje}%</text>
            </svg>
          </div>
        </div>
        
        <!-- Sección inferior: Descripción y enlace -->
        <div class="career-description">
          <p>${descripcion}</p>
          <div class="career-actions">
            <a href="${pdfUrl}" target="_blank" class="more-info-link">
              📄 Más información
            </a>
          </div>
        </div>
        
      </div>
    `;
  });

  resultadosHTML += `
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; margin-bottom: 20px;">
          <em>Tus respuestas han sido guardadas para seguimiento académico.</em>
        </p>
        <button type="button" id="btn-reiniciar" class="btn">Realizar Test Nuevamente</button>
      </div>
    </div>
  `;

  // Cerrar el Sweet Alert cuando TODO esté listo
  Swal.close();

  testForm.classList.add('hidden');
  resultsDiv.innerHTML = resultadosHTML;
  resultsDiv.classList.remove('hidden');

  // Asegurar que el scroll vaya a los resultados
  resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

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