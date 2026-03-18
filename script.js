
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const diasPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const festivosNacionales = {
  '1-1': 'Año Nuevo',
  '4-2': 'Jueves Santo',
  '4-3': 'Viernes Santo',
  '5-1': 'Trabajo',
  '8-15': 'Asunción',
  '10-12': 'Hispanidad',
  '12-8': 'Inmaculada',
  '12-25': 'Navidad'
};

const festivosAutonomicos = {
  '1-6': 'Reyes',
  '3-19': 'San José',
  '6-9': 'Región de Murcia',
  '12-7': 'Virgen'
};

const festivosLocales = {
  '12-9': 'Festividad local',
  '9-14': 'Lunes de Feria'

};

const acordadosEmpresa = {
};

let horasPorDia = {};
let estadoDias = {};

function inicializarHoras() {
  for (let mes = 0; mes < 12; mes++) {
    for (let dia = 1; dia <= diasPorMes[mes]; dia++) {
      const clave = `${mes}-${dia}`;
      if (!esFinde(mes, dia) && !esFestivo(mes, dia)) {
        horasPorDia[clave] = getHorasLaboralesDefault(mes, dia);
      }
    }
  }
}

function esFinde(mes, dia) {
  const fecha = new Date(2026, mes, dia);
  const diaSemana = fecha.getDay();
  return diaSemana === 0 || diaSemana === 6;
}

function esFestivo(mes, dia) {
  const clave = `${mes + 1}-${dia}`;
  return festivosNacionales.hasOwnProperty(clave) ||
    festivosAutonomicos.hasOwnProperty(clave) ||
    festivosLocales.hasOwnProperty(clave) ||
    acordadosEmpresa.hasOwnProperty(clave);
}

function getTipoFestivo(mes, dia) {
  const clave = `${mes + 1}-${dia}`;
  if (festivosNacionales.hasOwnProperty(clave)) return 'nacional';
  if (festivosAutonomicos.hasOwnProperty(clave)) return 'autonomico';
  if (festivosLocales.hasOwnProperty(clave)) return 'local';
  if (acordadosEmpresa.hasOwnProperty(clave)) return 'acordado';
  return null;
}

function getHorasLaboralesDefault(mes, dia) {
  const fecha = new Date(2026, mes, dia);
  const diaSemana = fecha.getDay();
  if (diaSemana === 5) return 6;
  return 8.5;
}

function cambiarVista(vista) {
  document.querySelectorAll('.vista').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

  document.getElementById(`vista${vista.charAt(0).toUpperCase() + vista.slice(1)}`).classList.add('active');
  event.target.classList.add('active');

  if (vista === 'calendario' && document.getElementById('calendarioModerno').innerHTML === '') {
    crearCalendarioModerno();
  }
}

function crearCalendario() {
  const tabla = document.getElementById('calendario');
  let html = '<thead><tr><th>Mes</th>';

  for (let dia = 1; dia <= 31; dia++) {
    html += `<th>${dia}</th>`;
  }
  html += '<th class="total-header">Total</th></tr></thead><tbody>';

  for (let mes = 0; mes < 12; mes++) {
    html += `<tr><td class="mes-header">${meses[mes]}</td>`;

    for (let dia = 1; dia <= 31; dia++) {
      if (dia > diasPorMes[mes]) {
        html += '<td class="vacio"></td>';
      } else {
        const clave = `${mes}-${dia}`;
        const esFin = esFinde(mes, dia);
        const tipoFestivo = getTipoFestivo(mes, dia);

        let clase = 'laboral';
        let contenido = '';

        if (esFin) {
          clase = 'finde';
          contenido = 'X';
        } else if (tipoFestivo === 'nacional') {
          clase = 'festivo-nacional';
          contenido = 'NL';
        } else if (tipoFestivo === 'autonomico') {
          clase = 'festivo-autonomico';
          contenido = 'C';
        } else if (tipoFestivo === 'local') {
          clase = 'festivo-local';
          contenido = 'NL';
        } else if (tipoFestivo === 'acordado') {
          clase = 'acordado-empresa';
          contenido = 'A';
        } else if (estadoDias[clave] === 'V') {
          clase = 'vacaciones';
          contenido = 'V';
        } else {
          const horas = horasPorDia[clave] || getHorasLaboralesDefault(mes, dia);
          contenido = `<input type="number" value="${horas}" step="0.5" min="0" 
                                 onchange="actualizarHoras(${mes}, ${dia}, this.value)" 
                                 onclick="event.stopPropagation()">`;
        }

        if (clase === 'laboral') {
          html += `<td class="${clase}" onclick="toggleVacaciones(${mes}, ${dia})" title="Clic para marcar/desmarcar vacaciones">${contenido}</td>`;
        } else if (clase === 'vacaciones') {
          html += `<td class="${clase}" onclick="toggleVacaciones(${mes}, ${dia})" title="Clic para marcar/desmarcar vacaciones">${contenido}</td>`;
        } else {
          html += `<td class="${clase}">${contenido}</td>`;
        }
      }
    }

    const totalMes = calcularTotalMes(mes);
    html += `<td class="total-cell">${totalMes.toFixed(1)}</td>`;
    html += '</tr>';
  }

  html += '</tbody>';
  tabla.innerHTML = html;
}

function crearCalendarioModerno() {
  const contenedor = document.getElementById('calendarioModerno');
  let html = '';

  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  for (let mes = 0; mes < 12; mes++) {
    html += `<div class="mes-box">
            <div class="mes-header-cal">${meses[mes]} 2026</div>
            <div class="dias-semana-grid">`;

    for (let ds of diasSemana) {
      html += `<div class="dia-semana-nombre">${ds}</div>`;
    }

    html += '</div><div class="dias-grid">';

    const primerDia = new Date(2026, mes, 1);
    let diaSemanaInicio = primerDia.getDay();
    diaSemanaInicio = diaSemanaInicio === 0 ? 6 : diaSemanaInicio - 1;

    for (let i = 0; i < diaSemanaInicio; i++) {
      html += '<div class="dia-box vacio-box"></div>';
    }

    for (let dia = 1; dia <= diasPorMes[mes]; dia++) {
      const clave = `${mes}-${dia}`;
      const esFin = esFinde(mes, dia);
      const tipoFestivo = getTipoFestivo(mes, dia);

      let clase = 'laboral';
      let info = '';

      if (esFin) {
        clase = 'finde';
        info = '';
      } else if (tipoFestivo === 'nacional') {
        clase = 'festivo-nacional';
        info = 'NL';
      } else if (tipoFestivo === 'autonomico') {
        clase = 'festivo-autonomico';
        info = 'C';
      } else if (tipoFestivo === 'local') {
        clase = 'festivo-local';
        info = 'NL';
      } else if (tipoFestivo === 'acordado') {
        clase = 'acordado-empresa';
        info = 'A';
      } else if (estadoDias[clave] === 'V') {
        clase = 'vacaciones';
        info = 'V';
      } else {
        const horas = horasPorDia[clave] || getHorasLaboralesDefault(mes, dia);
        info = horas + 'h';
      }

      html += `<div class="dia-box ${clase}" onclick="toggleVacacionesCalendario(${mes}, ${dia})" title="Clic para marcar/desmarcar vacaciones">
                <div class="dia-num">${dia}</div>
                <div class="dia-info">${info}</div>
            </div>`;
    }

    html += '</div></div>';
  }

  contenedor.innerHTML = html;
}

function actualizarHoras(mes, dia, valor) {
  const clave = `${mes}-${dia}`;
  horasPorDia[clave] = parseFloat(valor) || 0;
  calcularTotales();
  crearCalendario();
}

function toggleVacaciones(mes, dia) {
  if (esFinde(mes, dia) || esFestivo(mes, dia)) return;

  const clave = `${mes}-${dia}`;

  if (estadoDias[clave] === 'V') {
    delete estadoDias[clave];
  } else {
    estadoDias[clave] = 'V';
  }

  crearCalendario();
  calcularTotales();
}

function toggleVacacionesCalendario(mes, dia) {
  toggleVacaciones(mes, dia);
  crearCalendarioModerno();
}

function calcularTotalMes(mes) {
  let total = 0;
  for (let dia = 1; dia <= diasPorMes[mes]; dia++) {
    const clave = `${mes}-${dia}`;
    if (!esFinde(mes, dia) && !esFestivo(mes, dia) && estadoDias[clave] !== 'V') {
      total += horasPorDia[clave] || 0;
    }
  }
  return total;
}

function calcularTotales() {
  let totalAnual = 0;
  let horasVacaciones = 0;
  let diasLaborablesTotales = 0;

  for (let mes = 0; mes < 12; mes++) {
    for (let dia = 1; dia <= diasPorMes[mes]; dia++) {
      const clave = `${mes}-${dia}`;

      if (!esFinde(mes, dia) && !esFestivo(mes, dia)) {
        const horas = horasPorDia[clave] || 0;
        totalAnual += horas;
        diasLaborablesTotales++;

        if (estadoDias[clave] === 'V') {
          horasVacaciones += horas;
        }
      }
    }
  }

  const pendientesAnterior = parseFloat(document.getElementById('pendientesAnterior').value) || 0;
  const convenio = parseFloat(document.getElementById('horasConvenio').value) || 1800;

  // Total horas que se pueden coger = (Lo que trabajaría si no coge nada + pendientes) - lo que DEBE trabajar
  const bolsaVacaciones = (totalAnual + pendientesAnterior) - convenio;

  // Saldo que le queda
  const saldoRestanteHoras = bolsaVacaciones - horasVacaciones;

  // Calcular dias. Asumimos jornada promedio.
  const promedioHorasDia = totalAnual / diasLaborablesTotales;
  const diasRestantes = saldoRestanteHoras / promedioHorasDia;

  document.getElementById('totalAnual').textContent = totalAnual.toFixed(1);
  document.getElementById('bolsaVacaciones').textContent = bolsaVacaciones.toFixed(1);
  document.getElementById('horasVacaciones').textContent = horasVacaciones.toFixed(1);

  const saldoElement = document.getElementById('saldoRestante');
  saldoElement.textContent = saldoRestanteHoras.toFixed(1) + 'h';

  const diasElement = document.getElementById('diasRestantesInfo');
  diasElement.textContent = `Quedan ${diasRestantes.toFixed(1)} días`;

  if (saldoRestanteHoras < 0) {
    saldoElement.parentElement.classList.add('error');
  } else {
    saldoElement.parentElement.classList.remove('error');
  }

  guardarLocal();
}

function guardarLocal() {
  const datos = {
    horasPorDia,
    estadoDias,
    pendientesAnterior: parseFloat(document.getElementById('pendientesAnterior').value) || 0,
    convenio: parseFloat(document.getElementById('horasConvenio').value) || 1800
  };
  localStorage.setItem('calendario2026_datos', JSON.stringify(datos));
}

function cargarLocal() {
  const stored = localStorage.getItem('calendario2026_datos');
  if (stored) {
    try {
      const datos = JSON.parse(stored);
      if (datos.horasPorDia) horasPorDia = datos.horasPorDia;
      if (datos.estadoDias) estadoDias = datos.estadoDias;
      if (datos.pendientesAnterior !== undefined) {
        document.getElementById('pendientesAnterior').value = datos.pendientesAnterior;
      }
      if (datos.convenio !== undefined) {
        document.getElementById('horasConvenio').value = datos.convenio;
      }
    } catch (e) {
      console.error('Error al cargar datos de localStorage:', e);
    }
  }
}

function exportarDatos() {
  const datos = {
    horasPorDia,
    estadoDias,
    pendientesAnterior: parseFloat(document.getElementById('pendientesAnterior').value) || 0,
    convenio: parseFloat(document.getElementById('horasConvenio').value) || 1800
  };

  const dataStr = JSON.stringify(datos, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'calendario_laboral_2026.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importarDatos(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const datos = JSON.parse(e.target.result);

      if (datos.horasPorDia) horasPorDia = datos.horasPorDia;
      if (datos.estadoDias) estadoDias = datos.estadoDias;
      if (datos.pendientesAnterior !== undefined) {
        document.getElementById('pendientesAnterior').value = datos.pendientesAnterior;
      }
      if (datos.convenio !== undefined) {
        document.getElementById('horasConvenio').value = datos.convenio;
      }

      crearCalendario();
      const calendarioModerno = document.getElementById('calendarioModerno');
      if (calendarioModerno.innerHTML !== '') {
        crearCalendarioModerno();
      }
      calcularTotales();

      alert('Datos importados correctamente');
    } catch (error) {
      alert('Error al importar el archivo: ' + error.message);
    }
  };
  reader.readAsText(file);
}

inicializarHoras();
cargarLocal();
crearCalendario();
calcularTotales();