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
    {
        text: 'Me gusta cuando las cosas funcionan de manera ordenada en un grupo.',
        carreras: ['Administracion de empresas', 'Comunicacion']
    },
    {
        text: 'Disfruto cuando alguien entiende mejor algo gracias a mí.',
        carreras: ['Pedagogia']
    },
    {
        text: 'Me emociona probar sabores nuevos y combinar ingredientes.',
        carreras: ['Artes culinarias']
    },
    {
        text: 'Me interesa comprender cómo funcionan las reglas en la sociedad.',
        carreras: ['Derecho']
    },
    {
        text: 'Me resulta interesante manejar presupuestos o balances.',
        carreras: ['Contaduria', 'Administracion de empresas']
    },
    {
        text: 'Me gusta imaginar cómo sería crear una herramienta digital.',
        carreras: ['Programacion/Webmaster', 'Sistemas computacionales']
    },
    {
        text: 'No me incomoda hablar frente a varias personas.',
        carreras: ['Comunicacion', 'Derecho']
    },
    {
        text: 'Siento curiosidad por descubrir por qué algo falla y arreglarlo.',
        carreras: ['Sistemas Computacionales', 'Programacion/Webmaster']
    },
    {
        text: 'Me gusta acompañar a las personas a encontrar una solución a sus dudas.',
        carreras: ['Pedagogia', 'Administracion de empresas']
    },
    {
        text: 'Me siento en mi ambiente cuando estoy en una cocina.',
        carreras: ['Artes culinarias']
    }
];


const iconosCarrera = {
    'Administracion de empresas': 'img/administracion.png',
    'Pedagogia': 'img/pedagogia.png',
    'Artes culinarias': 'img/artes.png',
    'Derecho': 'img/derecho.png',
    'Contaduria': 'img/contaduria.png',
    'Programacion/Webmaster': 'img/programacion.png',
    'Comunicacion': 'img/comunicacion.png',
    'Sistemas computacionales': 'img/sistemas.png'
};


const startForm = document.getElementById('start-form');
const testForm = document.getElementById('test-form');
const resultsDiv = document.getElementById('results');

let campusSeleccionado = '';
let turnoSeleccionado = '';
let carreraSeleccionada = [];

startForm.addEventListener('submit', function(e) {
    e.preventDefault();
    campusSeleccionado = document.getElementById('campus').value;
    turnoSeleccionado = document.getElementById('turno').value;
    if (!campusSeleccionado || !turnoSeleccionado) return;
    carreraSeleccionada = carreras[campusSeleccionado];
    showTestForm();
});

function showTestForm() {
    startForm.classList.add('hidden');
    testForm.innerHTML = '';
    resultsDiv.innerHTML = ''; // Limpia resultados previos
    let qNum = 1;
    preguntas.forEach((q, idx) => {
        const relevant = q.carreras.some(c => carreraSeleccionada.includes(c));
        if (!relevant) return;
        const div = document.createElement('div');
        div.className = 'form-group';
        div.innerHTML = `<label>${qNum}. ${q.text}</label>
            <div>
                <label><input type="radio" name="q${idx}" value="1" required> Si</label>
                <label><input type="radio" name="q${idx}" value="0"> No</label>
            </div>`;
        testForm.appendChild(div);
        qNum++;
    });
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn';
    btn.textContent = 'Ver Resultados';
    testForm.appendChild(btn);
    testForm.classList.remove('hidden');
}

testForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const puntajes = {};
    carreraSeleccionada.forEach(c => puntajes[c] = 0);
    let totalRelevante = 0;
    preguntas.forEach((q, idx) => {
        if (!q.carreras.some(c => carreraSeleccionada.includes(c))) return;
        const val = testForm.querySelector(`input[name="q${idx}"]:checked`);
        if (val && val.value === '1') {
            q.carreras.forEach(carrera => {
                if (carreraSeleccionada.includes(carrera)) puntajes[carrera]++;
            });
        }
        totalRelevante++;
    });
    showResults(puntajes, totalRelevante);
});

function showResults(puntajes, totalRelevante) {
    resultsDiv.innerHTML = '<h2 style="color: #fff;">Tus mejores oportunidades academicas</h2>';
    const preguntasPorCarrera = {};
    carreraSeleccionada.forEach(carrera => {
        preguntasPorCarrera[carrera] = preguntas.filter(q => q.carreras.includes(carrera)).length;
    });
    const sorted = Object.entries(puntajes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3); // Solo las 3 mejores carreras
    sorted.forEach(([carrera, puntaje]) => {
        const totalPreguntasCarrera = preguntasPorCarrera[carrera] || 1;
        const percent = Math.round((puntaje / totalPreguntasCarrera) * 100);
        const iconSrc = iconosCarrera[carrera] || 'img/default.png';
        const radius = 28;
        const stroke = 6;
        const normalizedPercent = Math.max(0, Math.min(percent, 100));
        const circumference = 2 * Math.PI * radius;
        const offset = circumference * (1 - normalizedPercent / 100);
        const color = "#00e1ff"; // azul neon

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

function mostrarBarrasScroll() {
    const superior = document.querySelector('.barra-superior');
    const inferior = document.querySelector('.barra-inferior');
    const scrollY = window.scrollY;
    const windowH = window.innerHeight;
    const docH = document.body.scrollHeight;

    // Mostrar barra superior solo si está arriba
    if (scrollY < 10) {
        superior.classList.add('barra-visible');
    } else {
        superior.classList.remove('barra-visible');
    }

    // Mostrar barra inferior solo si está abajo
    if (scrollY + windowH > docH - 10) {
        inferior.classList.add('barra-visible');
    } else {
        inferior.classList.remove('barra-visible');
    }
}

window.addEventListener('scroll', mostrarBarrasScroll);
window.addEventListener('resize', mostrarBarrasScroll);
document.addEventListener('DOMContentLoaded', mostrarBarrasScroll);
