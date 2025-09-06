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
    { text: 'Me resulta comodo hablar frente a varias personas.', carreras: ['Comunicacion', 'Derecho'] },
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

    const q = preguntasFiltradas[index];
    const div = document.createElement('div');
    div.className = 'form-group';
    div.innerHTML = `
        <label>${index + 1}. ${q.text}</label>
        <div>
            <label><input type="radio" name="q${index}" value="1" required> Si</label>
            <label><input type="radio" name="q${index}" value="0"> No</label>
        </div>
    `;
    testForm.appendChild(div);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn';
    btn.textContent = (index === preguntasFiltradas.length - 1) ? 'Ver Resultados' : 'Siguiente';
    btn.addEventListener('click', () => {
        const val = testForm.querySelector(`input[name="q${index}"]:checked`);
        if (!val) {
            alert("Selecciona una opción antes de continuar");
            return;
        }
        preguntasFiltradas[index].respuesta = val.value;
        preguntaActual = index + 1;
        actualizarProgreso();
        showPregunta(index + 1);
    });
    testForm.appendChild(btn);
}

function actualizarProgreso() {
    const percent = Math.round((preguntaActual / preguntasFiltradas.length) * 100);
    progressBar.querySelector(".progress-text").textContent = `${percent}%`;
    progressBar.querySelector(".progress-fill").style.width = `${percent}%`;
}

function calcularResultados() {
    const puntajes = {};
    carreraSeleccionada.forEach(c => puntajes[c] = 0);

    preguntasFiltradas.forEach(q => {
        if (q.respuesta === "1") {
            q.carreras.forEach(carrera => {
                if (carreraSeleccionada.includes(carrera)) puntajes[carrera]++;
            });
        }
    });

    showResults(puntajes);
}

function showResults(puntajes) {
    resultsDiv.innerHTML = '<h2 style="color: #fff;">Tus mejores oportunidades academicas</h2>';
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
        const iconSrc = iconosCarrera[carrera] || '../src/img/default.png';
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

}


function showResults(puntajes) {
    resultsDiv.innerHTML = '<h2 style="color: #fff;">Las carreras que más coinciden con tus intereses son:</h2>';
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
        const iconSrc = iconosCarrera[carrera] || '../src/img/default.png';
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

    // Botón para regresar al inicio
    const backBtn = document.createElement("button");
    backBtn.textContent = "Regresar al inicio";
    backBtn.className = "btn";
    backBtn.style.marginTop = "20px";
    backBtn.addEventListener("click", () => {
        resultsDiv.innerHTML = "";
        startForm.reset();
        startForm.classList.remove("hidden");
        testForm.classList.add("hidden");
        progressBar.classList.add("hidden");
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
    resultsDiv.appendChild(backBtn);

}
