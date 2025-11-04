// Variables globales
let campusSeleccionado = "";
let turnoSeleccionado = "";
let preguntaActual = 0;
let respuestasUsuario = {};
let preguntasFiltradas = [];

// Datos del formulario
const startForm = document.getElementById("start-form");
const testForm = document.getElementById("test-form");
const resultsDiv = document.getElementById("results");

// Definición de carreras por campus
const carrerasPorCampus = {
  Campeche: [
    "Administración de empresas",
    "Comunicación",
    "Pedagogía",
    "Artes culinarias",
    "Derecho",
    "Contaduría",
    "Programación",
    "Sistemas computacionales",
  ],
  Escarcega: [
    "Administración de empresas",
    "Pedagogía",
    "Derecho",
    "Contaduría",
  ],
};

// Información detallada de cada carrera
const informacionCarreras = {
  "Administración de empresas": {
    descripcion:
      "Forma líderes capaces de dirigir organizaciones, tomar decisiones estratégicas y gestionar recursos humanos y financieros de manera eficiente.",
    pdf: "src/planes/administracion.jpg",
  },
  Comunicación: {
    descripcion:
      "Desarrolla profesionales en medios, marketing digital, relaciones públicas y creación de contenido para diversas plataformas.",
    pdf: "src/planes/comunicacion.jpg",
  },
  Pedagogía: {
    descripcion:
      "Prepara educadores comprometidos con la formación integral, diseño curricular y metodologías innovadoras de enseñanza-aprendizaje.",
    pdf: "src/planes/pedagogia.jpg",
  },
  "Artes culinarias": {
    descripcion:
      "Forma chefs profesionales con técnicas gastronómicas avanzadas, administración de cocina y creación de experiencias culinarias únicas.",
    pdf: "src/planes/artes.jpg",
  },
  Derecho: {
    descripcion:
      "Prepara juristas íntegros con sólidos conocimientos legales para ejercer en diversas áreas del derecho y la justicia.",
    pdf: "src/planes/derecho.jpg",
  },
  Contaduría: {
    descripcion:
      "Desarrolla expertos en finanzas, auditoría, fiscalización y análisis contable para la toma de decisiones empresariales.",
    pdf: "src/planes/contaduria.jpg",
  },
  Programación: {
    descripcion:
      "Forma desarrolladores web especializados en programación, diseño de interfaces y gestión de proyectos digitales.",
    pdf: "src/planes/programacion.jpg",
  },
  "Sistemas computacionales": {
    descripcion:
      "Prepara ingenieros en sistemas capaces de desarrollar software, administrar redes y solucionar problemas tecnológicos complejos.",
    pdf: "src/planes/sistemas.jpg",
  },
};

const todasLasPreguntas = [
  {
    id: 1,
    texto:
      "Prefiero organizar recursos y coordinar tareas de forma que todos los integrantes de un grupo alcancen sus metas, aunque eso implique negociar prioridades constantemente.",
    carreras: ["Administración de empresas"],
  },
  {
    id: 2,
    texto:
      "Me siento motivado/a cuando puedo adaptar mis explicaciones para que otras personas comprendan conceptos difíciles.",
    carreras: ["Pedagogía"],
  },
  {
    id: 3,
    texto:
      "Me atrae combinar elementos distintos para crear algo que provoque una experiencia sensorial completa (sabor, textura, presentación).",
    carreras: ["Artes culinarias"],
  },
  {
    id: 4,
    texto:
      "Me interesa analizar situaciones complejas y estructurarlas de manera lógica para proponer soluciones justas.",
    carreras: ["Derecho"],
  },
  {
    id: 5,
    texto:
      "Me siento cómodo/a trabajando con cifras y datos para detectar patrones y discrepancias.",
    carreras: ["Contaduría"],
  },
  {
    id: 6,
    texto:
      "Me atrae enfrentar problemas complejos y descomponerlos en pasos lógicos hasta encontrar la solución.",
    carreras: ["Programación"],
  },
  {
    id: 7,
    texto:
      "Me siento cómodo/a expresando ideas de manera clara y persuasiva a distintos tipos de público.",
    carreras: ["Comunicación"],
  },
  {
    id: 8,
    texto:
      "Disfruto diseñar y probar soluciones complejas que mejoren la eficiencia de procesos o sistemas.",
    carreras: ["Sistemas computacionales"],
  },
  {
    id: 9,
    texto:
      "Cuando surge un problema en un proyecto, me enfoco en definir soluciones concretas y asignar responsabilidades más que esperar a que se resuelva solo.",
    carreras: ["Administración de empresas"],
  },
  {
    id: 10,
    texto:
      "Disfruto observar cómo otros aprenden y ajustar mi enfoque según sus reacciones y necesidades.",
    carreras: ["Pedagogía"],
  },
  {
    id: 11,
    texto:
      "Prefiero ambientes activos donde la precisión y el tiempo son esenciales para el resultado final.",
    carreras: ["Artes culinarias"],
  },
  {
    id: 12,
    texto:
      "Disfruto argumentar y defender posiciones con evidencia y razonamiento sólido.",
    carreras: ["Derecho"],
  },
  {
    id: 13,
    texto:
      "Prefiero actividades metódicas que requieran atención al detalle y precisión constante.",
    carreras: ["Contaduría"],
  },
  {
    id: 14,
    texto:
      "Prefiero crear soluciones que otros puedan usar digitalmente, más que teorizar sobre ellas.",
    carreras: ["Programación"],
  },
  {
    id: 15,
    texto:
      "Disfruto investigar y estructurar información para que otros puedan comprenderla y utilizarla.",
    carreras: ["Comunicación"],
  },
  {
    id: 16,
    texto:
      "Me atrae analizar datos y estructuras para detectar errores o oportunidades de mejora.",
    carreras: ["Sistemas computacionales"],
  },
  {
    id: 17,
    texto:
      "Prefiero entornos donde puedo experimentar, investigar y aplicar soluciones técnicas.",
    carreras: ["Programación"],
  },
  {
    id: 18,
    texto:
      "Me motiva mantener sistemas seguros y funcionales, anticipando problemas antes de que ocurran.",
    carreras: ["Sistemas computacionales"],
  },
  {
    id: 19,
    texto:
      "Prefiero proyectos colaborativos donde la creatividad y la estrategia de comunicación sean esenciales.",
    carreras: ["Comunicación"],
  },
  {
    id: 20,
    texto:
      "Disfruto aprender y aplicar nuevas tecnologías y herramientas para mejorar procesos existentes.",
    carreras: ["Sistemas computacionales"],
  },
  {
    id: 21,
    texto:
      "Disfruto prever recursos y planificar para que todo se mantenga equilibrado y dentro de límites.",
    carreras: ["Administración de empresas"],
  },
  {
    id: 22,
    texto:
      "Prefiero ambientes donde se valoren las normas y se busque equilibrio entre diferentes intereses.",
    carreras: ["Derecho"],
  },
  {
    id: 23,
    texto:
      "Disfruto trabajar con mis manos para materializar ideas, más que solo leer sobre ellas.",
    carreras: ["Artes culinarias"],
  },
  {
    id: 24,
    texto:
      "Disfruto de entornos en donde el éxito se mida por el crecimiento de los demás.",
    carreras: ["Pedagogía"],
  },
  {
    id: 25,
    texto:
      "Me atrae analizar situaciones complejas para encontrar patrones que permitan tomar decisiones más eficientes.",
    carreras: ["Contaduría"],
  },
  {
    id: 26,
    texto:
      "Disfruto evaluar resultados y diseñar estrategias de mejora, incluso si implica supervisar a otros.",
    carreras: ["Administración de empresas"],
  },
  {
    id: 27,
    texto:
      "Tengo paciencia para acompañar a alguien a superar dificultades, incluso si es un proceso largo y repetitivo.",
    carreras: ["Pedagogía"],
  },
  {
    id: 28,
    texto:
      "Me motiva experimentar, probar nuevas técnicas y corregir errores hasta perfeccionar un resultado tangible.",
    carreras: ["Artes culinarias"],
  },
  {
    id: 29,
    texto:
      "Me motiva comprender cómo las reglas y acuerdos influyen en la vida de las personas y la sociedad.",
    carreras: ["Derecho"],
  },
  {
    id: 30,
    texto:
      "Me motiva que mis análisis permitan tomar decisiones financieras acertadas y responsables.",
    carreras: ["Contaduría"],
  },
  {
    id: 31,
    texto:
      "Me motiva optimizar sistemas para que funcionen de manera eficiente y sin errores, incluso si requiere esfuerzo repetitivo.",
    carreras: ["Programación"],
  },
  {
    id: 32,
    texto:
      "Me motiva influir en la percepción de otros y generar impacto mediante palabras, imágenes o medios.",
    carreras: ["Comunicación"],
  },
];

// Función para filtrar preguntas según el campus
function filtrarPreguntasPorCampus(campus) {
  const carrerasDisponibles = carrerasPorCampus[campus] || [];

  return todasLasPreguntas.filter((pregunta) => {
    return pregunta.carreras.some((carrera) =>
      carrerasDisponibles.includes(carrera)
    );
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
            <div class="progress-fill" style="width: ${
              ((indicePregunta + 1) / preguntasFiltradas.length) * 100
            }%"></div>
          </div>
        </div>
      </div>
      
      <div class="pregunta">
        <p><strong>${pregunta.texto}</strong></p>
        <div class="opciones-respuesta">
          <label class="opcion-radio">
            <input type="radio" name="pregunta_${pregunta.id}" value="1" ${
    respuestasUsuario[pregunta.id] === 1 ? "checked" : ""
  }>
            <span class="radio-custom"></span>
            Sí
          </label>
          <label class="opcion-radio">
            <input type="radio" name="pregunta_${pregunta.id}" value="0" ${
    respuestasUsuario[pregunta.id] === 0 ? "checked" : ""
  }>
            <span class="radio-custom"></span>
            No
          </label>
        </div>
      </div>
      
      <div class="navegacion-botones">
        <button type="button" id="btn-anterior" class="btn btn-secondary" ${
          indicePregunta === 0 ? "disabled" : ""
        }>
          ← Anterior
        </button>
      </div>
    </div>
  `;

  testForm.innerHTML = testFormContent;

  // Agregar event listeners para las respuestas (avance automático)
  const radios = testForm.querySelectorAll('input[type="radio"]');
  radios.forEach((radio) => {
    radio.addEventListener("change", function () {
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
  const btnAnterior = document.getElementById("btn-anterior");
  if (btnAnterior && !btnAnterior.disabled) {
    btnAnterior.addEventListener("click", function () {
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
    },
  });
}

// Función para calcular y mostrar resultados
async function mostrarResultados() {
  const carrerasDisponibles = carrerasPorCampus[campusSeleccionado];
  const puntajes = {};
  const preguntasPorCarrera = {};

  // Inicializar puntajes Y contar preguntas por carrera
  carrerasDisponibles.forEach((carrera) => {
    puntajes[carrera] = 0;
    preguntasPorCarrera[carrera] = 0;
  });

  //Contar cuántas preguntas corresponden a cada carrera
  preguntasFiltradas.forEach((pregunta) => {
    pregunta.carreras.forEach((carrera) => {
      if (preguntasPorCarrera.hasOwnProperty(carrera)) {
        preguntasPorCarrera[carrera]++;
      }
    });
  });

  // Calcular puntajes basado en las respuestas
  preguntasFiltradas.forEach((pregunta) => {
    const respuesta = respuestasUsuario[pregunta.id];
    if (respuesta === 1) {
      pregunta.carreras.forEach((carrera) => {
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
      porcentaje: Math.round((puntaje / preguntasPorCarrera[carrera]) * 100), // CORREGIDO AQUÍ
    }))
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, 3); // Solo los top 3

  console.log("Preguntas por carrera:", preguntasPorCarrera);
  console.log("Puntajes obtenidos:", puntajes);
  console.log("Resultados con porcentajes corregidos:", resultadosOrdenados);

  // OBTENER DATOS DE REGISTRO DESDE SESSIONSTORAGE
  const datosRegistro = JSON.parse(
    sessionStorage.getItem("datosRegistro") || "{}"
  );
  console.log("Datos de registro recuperados:", datosRegistro);

  // Convertir resultados a string plano, solo top 3
  const resultadosTop3 = resultadosOrdenados
    .slice(0, 3)
    .map((r) => (r && r.carrera ? r.carrera.toString() : "N/A"));

  const datosCompletos = {
    tipo: "testVocacional",
    nombre: datosRegistro.nombre || "No especificado",
    edad: datosRegistro.edad || "No especificado",
    email: datosRegistro.email || "No especificado",
    telefono: datosRegistro.telefono || "No especificado",
    campus: campusSeleccionado,
    turno: turnoSeleccionado,
    resultados: resultadosTop3.join(", "),
    fecha: new Date().toLocaleString(),
  };

  // Enviar TODOS los datos JUNTOS a Google Sheets
  try {
    const scriptURL =
      process.env.API_KEY;
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(datosCompletos),
      headers: { "Content-Type": "text/plain;charset=utf-8" },
    });
    const data = await response.json();
    if (data.status === "success") {
      console.log("✅ Datos completos guardados en Sheets");
      // Limpiar sessionStorage después de guardar exitosamente
      sessionStorage.removeItem("datosRegistro");
    }
  } catch (err) {
    console.error("Error al enviar a Sheets:", err);
  }

  // Función para obtener icono de carrera
  function obtenerIconoCarrera(carrera) {
    const iconos = {
      "Administración de empresas": "src/img/administracion.png",
      Comunicación: "src/img/comunicacion.png",
      Pedagogía: "src/img/pedagogia.png",
      "Artes culinarias": "src/img/artes.png",
      Derecho: "src/img/derecho.png",
      Contaduría: "src/img/contaduria.png",
      Programación: "src/img/programacion.png",
      "Sistemas computacionales": "src/img/sistemas.png",
    };
    return iconos[carrera] || "src/img/default.png";
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
    const medallaColor = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
    const radius = 28;
    const stroke = 6;
    const normalizedPercent = Math.max(0, Math.min(resultado.porcentaje, 100));
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - normalizedPercent / 100);
    const color = obtenerColorPorRanking(index);

    // Obtener información de la carrera
    const infoCarrera = informacionCarreras[resultado.carrera];
    const descripcion = infoCarrera
      ? infoCarrera.descripcion
      : "Descripción no disponible";
    const pdfUrl = infoCarrera ? infoCarrera.pdf : "#";

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
              <text x="30" y="36" text-anchor="middle" font-size="16" fill="#13235B" font-family="Segoe UI, Arial, sans-serif">${
                resultado.porcentaje
              }%</text>
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

  const mensajeWhatsApp = encodeURIComponent(
    `✅¡Estos son mis resultados del test vocacional!:✅\n\nCarreras recomendadas:\n${resultadosOrdenados
      .map((r) => `👉${r.carrera}: ${r.porcentaje}%`)
      .join("\n")}\n\n🏫Campus: ${campusSeleccionado}🏫\n`
  );

  resultadosHTML += `
      </div>
      <div style="text-align: center; margin-top: 30px;">
        <p style="color: #666; margin-bottom: 20px;">
          <em>Tus respuestas han sido guardadas para seguimiento académico.</em>
        </p>
        <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap"> 
          <button type="button" id="btn-reiniciar" class="btn">Realizar Test Nuevamente</button>
          <a href="https://api.whatsapp.com/send?phone=9817366021&text=${mensajeWhatsApp}" target="_blank" class="btn enviar-vinculacion">Enviar resultados a Vinculación Académica</a>
        </div>

      </div>
    </div>
  `;

  // Cerrar el Sweet Alert cuando TODO esté listo
  Swal.close();

  testForm.classList.add("hidden");
  resultsDiv.innerHTML = resultadosHTML;
  resultsDiv.classList.remove("hidden");

  // Asegurar que el scroll vaya a los resultados
  resultsDiv.scrollIntoView({ behavior: "smooth", block: "start" });

  // Event listener para reiniciar
  document
    .getElementById("btn-reiniciar")
    .addEventListener("click", function () {
      // Limpiar sessionStorage y regresar al inicio
      sessionStorage.removeItem("datosRegistro");
      window.location.href = "index.html";
    });
}

// Función para obtener color según ranking (oro, plata, bronce)
function obtenerColorPorRanking(index) {
  const colores = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Oro, Plata, Bronce
  return colores[index] || "#9E9E9E";
}

// Event listener para el formulario de inicio
if (startForm) {
  startForm.addEventListener("submit", function (e) {
    e.preventDefault();

    campusSeleccionado = document.getElementById("campus").value;
    turnoSeleccionado = document.getElementById("turno").value;

    console.log("Campus seleccionado:", campusSeleccionado);
    console.log("Turno seleccionado:", turnoSeleccionado);

    if (!campusSeleccionado || !turnoSeleccionado) {
      alert("Por favor selecciona una entidad y un horario");
      return;
    }

    // Filtrar preguntas según el campus
    preguntasFiltradas = filtrarPreguntasPorCampus(campusSeleccionado);
    console.log("Preguntas filtradas:", preguntasFiltradas.length);

    if (preguntasFiltradas.length === 0) {
      alert("No hay preguntas disponibles para el campus seleccionado");
      return;
    }

    // Ocultar formulario de inicio y mostrar test
    startForm.classList.add("hidden");
    testForm.classList.remove("hidden");

    // Limpiar resultados previos
    if (resultsDiv) {
      resultsDiv.innerHTML = "";
      resultsDiv.classList.add("hidden");
    }

    // Inicializar variables
    preguntaActual = 0;
    respuestasUsuario = {};

    // Mostrar primera pregunta
    mostrarPregunta(preguntaActual);
  });
}

// Debug: Verificar que los elementos existen
console.log("StartForm:", startForm);
console.log("TestForm:", testForm);
console.log("ResultsDiv:", resultsDiv);
