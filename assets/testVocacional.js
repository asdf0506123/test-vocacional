const carreras = {
    Campeche: [
        'Administracion de empresas',
        'Pedagogia',
        'Artes culinarias',
        'Derecho',
        'Contaduria',
        'Programacion/Webmaster',
        'Comunicacion',
        'Sistemas computacionales'
    ],
    Escarcega: [
        'Derecho',
        'Contaduria',
        'Pedagogia',
        'Administracion de empresas'
    ]
};

const preguntas = [ 
    { text: 'Me gusta cuando las cosas funcionan de manera ordenada en un grupo.', carreras: ['Administracion de empresas', 'Comunicacion'] },
    { text: 'Disfruto cuando alguien entiende mejor algo gracias a mí.', carreras: ['Pedagogia'] },
    { text: 'Me emociona probar sabores nuevos y combinar ingredientes.', carreras: ['Artes culinarias'] },
    { text: 'Me interesa comprender cómo funcionan las reglas en la sociedad.', carreras: ['Derecho'] },
    { text: 'Me resulta interesante manejar presupuestos o balances.', carreras: ['Contaduria', 'Administracion de empresas'] },
    { text: 'Me gusta imaginar cómo sería crear una herramienta digital.', carreras: ['Programacion/Webmaster', 'Sistemas computacionales'] },
    { text: 'No me incomoda hablar frente a varias personas.', carreras: ['Comunicacion', 'Derecho'] },
    { text: 'Siento curiosidad por descubrir por qué algo falla y arreglarlo.', carreras: ['Sistemas Computacionales', 'Programacion/Webmaster'] },
    { text: 'Me gusta acompañar a las personas a encontrar una solución a sus dudas.', carreras: ['Pedagogia', 'Administracion de empresas'] },
    { text: 'Me siento en mi ambiente cuando estoy en una cocina.', carreras: ['Artes culinarias'] }
];

const iconosCarrera = {
    'Administracion de empresas': 'src/img/administracion.png',
    'Pedagogia': 'src/img/pedagogia.png',
    'Artes culinarias': 'src/img/artes.png',
    'Derecho': 'src/img/derecho.png',
    'Contaduria': 'src/img/contaduria.png',
    'Programacion/Webmaster': 'src/img/programacion.png',
    'Comunicacion': 'src/img/comunicacion.png',
    'Sistemas computacionales': 'src/img/sistemas.png'
};

const startForm = document.getElementById('start-form');
const testForm = document.getElementById('test-form');
const resultsDiv = document.getElementById('results');

let campusSeleccionado = '';
let turnoSeleccionado = '';
let carreraSeleccionada = [];

let preguntasFiltradas = [];
let preguntaActual = 0;
let respuestas = {}; // Para guardar todas las respuestas

// Crear barra de progreso
const progressBar = document.createElement("div");
progressBar.className = "progress-bar-container hidden";
progressBar.innerHTML = `
    <div class="progress-text">0%</div>
    <div class="progress">
        <div class="progress-fill"></div>
    </div>
`;
document.querySelector(".container").insertBefore(progressBar, testForm);

startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    campusSeleccionado = document.getElementById('campus').value;
    turnoSeleccionado = document.getElementById('turno').value;
    if (!campusSeleccionado || !turnoSeleccionado) return;
    carreraSeleccionada = carreras[campusSeleccionado];
    prepararPreguntas();
    showPregunta(0);
});

function prepararPreguntas() {
    preguntasFiltradas = preguntas.filter(q => 
        q.carreras.some(c => carreraSeleccionada.includes(c))
    );
    preguntaActual = 0;
    respuestas = {}; // Reiniciar respuestas
    startForm.classList.add('hidden');
    testForm.classList.remove('hidden');
    testForm.innerHTML = '';
    resultsDiv.innerHTML = '';

    progressBar.classList.remove("hidden");
    actualizarProgreso();
}

function showPregunta(index) {
    testForm.innerHTML = '';
    if (index >= preguntasFiltradas.length) {
        calcularResultados();
        return;
    }

    preguntaActual = index;
    const q = preguntasFiltradas[index];
    
    // Crear contenedor de la pregunta
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
        <label>${index + 1}. ${q.text}</label>
        <div>
            <label><input type="radio" name="q${index}" value="1" ${respuestas[index] === '1' ? 'checked' : ''}> Sí</label>
            <label><input type="radio" name="q${index}" value="0" ${respuestas[index] === '0' ? 'checked' : ''}> No</label>
        </div>
    `;
    testForm.appendChild(div);

    // Variable para controlar el auto-avance
    let autoAdvanceEnabled = !respuestas[index]; // Solo auto-avance si no hay respuesta previa

    // Agregar event listeners para auto-avance
    const radioButtons = div.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            respuestas[index] = this.value;
            actualizarProgreso();
            
            // Auto-avance solo si es una respuesta nueva (no al regresar)
            if (autoAdvanceEnabled) {
                setTimeout(() => {
                    if (index === preguntasFiltradas.length - 1) {
                        // Es la última pregunta, ir a resultados
                        calcularResultados();
                    } else {
                        // Ir a la siguiente pregunta
                        showPregunta(index + 1);
                    }
                }, 300);
            }
        });
    });

    // Crear contenedor de botones
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 20px; justify-content: center;';

    // Botón Anterior (solo si no es la primera pregunta)
    if (index > 0) {
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'btn btn-secondary';
        prevBtn.textContent = 'Anterior';
        prevBtn.style.cssText = 'background-color: #6c757d; border-color: #6c757d;';
        prevBtn.addEventListener('click', () => {
            showPregunta(index - 1);
        });
        buttonContainer.appendChild(prevBtn);
    }

    // Botón Siguiente/Ver Resultados
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn';
    nextBtn.textContent = (index === preguntasFiltradas.length - 1) ? 'Ver Resultados' : 'Siguiente';
    nextBtn.addEventListener('click', () => {
        const val = testForm.querySelector(`input[name="q${index}"]:checked`);
        if (!val) {
            alert("Selecciona una opción antes de continuar");
            return;
        }
        respuestas[index] = val.value;
        actualizarProgreso();
        
        if (index === preguntasFiltradas.length - 1) {
            calcularResultados();
        } else {
            showPregunta(index + 1);
        }
    });
    buttonContainer.appendChild(nextBtn);

    testForm.appendChild(buttonContainer);
    actualizarProgreso();
}

function actualizarProgreso() {
    const respondidas = Object.keys(respuestas).length;
    const percent = Math.round((respondidas / preguntasFiltradas.length) * 100);
    progressBar.querySelector(".progress-text").textContent = `${percent}%`;
    progressBar.querySelector(".progress-fill").style.width = `${percent}%`;
}

function calcularResultados() {
    const puntajes = {};
    carreraSeleccionada.forEach(c => puntajes[c] = 0);

    preguntasFiltradas.forEach((q, index) => {
        if (respuestas[index] === "1") {
            q.carreras.forEach(carrera => {
                if (carreraSeleccionada.includes(carrera)) puntajes[carrera]++;
            });
        }
    });

    showResults(puntajes);
}

function showResults(puntajes) {
    resultsDiv.innerHTML = '<h2 style="color: #fff;">Tus mejores oportunidades académicas</h2>';
    testForm.classList.add('hidden');
    progressBar.classList.add("hidden");

    const preguntasPorCarrera = {};
    carreraSeleccionada.forEach(carrera => {
        preguntasPorCarrera[carrera] = preguntas.filter(q => q.carreras.includes(carrera)).length;
    });

    const sorted = Object.entries(puntajes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    sorted.forEach(([carrera, puntaje]) => {
        const totalPreguntasCarrera = preguntasPorCarrera[carrera] || 1;
        const percent = Math.round((puntaje / totalPreguntasCarrera) * 100);
        const iconSrc = iconosCarrera[carrera] || 'img/default.png';
        const radius = 28;
        const stroke = 6;
        const normalizedPercent = Math.max(0, Math.min(percent, 100));
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - normalizedPercent / 100);
        const color = "#00e1ff";

        const careerDiv = document.createElement('div');
        careerDiv.className = 'career-result';
        careerDiv.innerHTML = `
            <div class="career-info">
                <div class="career-icon">
                    <img src="${iconSrc}" alt="${carrera}" />
                </div>
                <div class="career-title">${carrera}</div>
                <div class="progress-circle">
                    <svg width="64" height="64">
                        <circle
                            class="circle-bg"
                            cx="32" cy="32" r="${radius}"
                            stroke="#e3e8f0"
                            stroke-width="${stroke}"
                            fill="none"
                        />
                        <circle
                            class="circle"
                            cx="32" cy="32" r="${radius}"
                            stroke="${color}"
                            stroke-width="${stroke}"
                            fill="none"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                            stroke-linecap="round"
                        />
                        <text
                            x="32" y="38"
                            text-anchor="middle"
                            font-size="18"
                            fill="#13235B"
                            font-family="Segoe UI, Arial, sans-serif"
                        >${percent}%</text>
                    </svg>
                </div>
            </div>
        `;
        resultsDiv.appendChild(careerDiv);
    });

    // Contenedor de botones en resultados
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display: flex; gap: 10px; margin-top: 20px; justify-content: center;';

    // Botón para volver a las preguntas
    const backToQuestionsBtn = document.createElement("button");
    backToQuestionsBtn.textContent = "Revisar respuestas";
    backToQuestionsBtn.className = "btn btn-secondary";
    backToQuestionsBtn.style.cssText = 'background-color: #6c757d; border-color: #6c757d;';
    backToQuestionsBtn.addEventListener("click", () => {
        resultsDiv.innerHTML = "";
        testForm.classList.remove("hidden");
        progressBar.classList.remove("hidden");
        showPregunta(preguntasFiltradas.length - 1); // Ir a la última pregunta
    });
    buttonContainer.appendChild(backToQuestionsBtn);

    // Botón para regresar al inicio
    const backBtn = document.createElement("button");
    backBtn.textContent = "Hacer nuevo test";
    backBtn.className = "btn";
    backBtn.addEventListener("click", () => {
        resultsDiv.innerHTML = "";
        respuestas = {};
        startForm.reset();
        startForm.classList.remove("hidden");
        testForm.classList.add("hidden");
        progressBar.classList.add("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    buttonContainer.appendChild(backBtn);

    resultsDiv.appendChild(buttonContainer);
}

async function enviarResultadosAGoogleSheets(resultadosData) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz1ulYy0Gd9o8Sap19XFBCK0i3Sxyz89IkDo6B-Xvbv6RgN2KcMrYmEEhiECiXGxJsA/exec'; // ⚠️ REEMPLAZAR CON TU URL REAL
    
    if (SCRIPT_URL === 'Thttps://script.google.com/macros/s/AKfycbz1ulYy0Gd9o8Sap19XFBCK0i3Sxyz89IkDo6B-Xvbv6RgN2KcMrYmEEhiECiXGxJsA/exec') {
        console.error('❌ URL del script no configurada');
        mostrarMensajeError('URL del script no configurada. Revisa la configuración.');
        return;
    }
    

    const dataToSend = {
        tipo: 'testVocacional',
        campus: resultadosData.campus,
        turno: resultadosData.turno,
        resultados: resultadosData.resultados
    };
    
    console.log('Enviando a Google Sheets:', dataToSend);
    console.log('URL del script:', SCRIPT_URL);
    
    try {
       
        const xhr = new XMLHttpRequest();
        
        return new Promise((resolve, reject) => {
            xhr.open('POST', SCRIPT_URL, true);
            xhr.setRequestHeader('Content-Type', 'text/plain'); 
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        try {
                            const result = JSON.parse(xhr.responseText);
                            console.log('Respuesta del servidor:', result);
                            
                            if (result.status === 'success') {
                                console.log('✅ Resultados guardados exitosamente');
                                mostrarMensajeExito();
                                resolve(result);
                            } else {
                                console.error('❌ Error al guardar:', result.message);
                                mostrarMensajeError('Error al guardar: ' + result.message);
                                reject(new Error(result.message));
                            }
                        } catch (parseError) {
                            console.error('❌ Error parsing response:', parseError);
                            mostrarMensajeError('Error en la respuesta del servidor');
                            reject(parseError);
                        }
                    } else {
                        console.error('❌ HTTP Error:', xhr.status, xhr.statusText);
                        mostrarMensajeError(`Error HTTP: ${xhr.status}`);
                        reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                    }
                }
            };
            
            xhr.onerror = function() {
                console.error('❌ Error de red');
                mostrarMensajeError('Error de conexión a Google Sheets');
                reject(new Error('Network error'));
            };
            
            
            xhr.send(JSON.stringify(dataToSend));
        });
        
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        mostrarMensajeError('Error inesperado: ' + error.message);
    }
}


function mostrarMensajeExito() {
    const mensaje = document.createElement('div');
    mensaje.innerHTML = '<p style="color: #00e1ff; text-align: center; margin-top: 10px;">✅ Resultados guardados correctamente</p>';
    mensaje.id = 'mensaje-resultado';
    resultsDiv.appendChild(mensaje);
    

    setTimeout(() => {
        const mensajeExistente = document.getElementById('mensaje-resultado');
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
    }, 5000);
}


function mostrarMensajeError(errorMsg) {
    const mensaje = document.createElement('div');
    mensaje.innerHTML = `<p style="color: #ff6b6b; text-align: center; margin-top: 10px;">❌ ${errorMsg}</p>`;
    mensaje.id = 'mensaje-resultado';
    resultsDiv.appendChild(mensaje);

    setTimeout(() => {
        const mensajeExistente = document.getElementById('mensaje-resultado');
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
    }, 8000);
}