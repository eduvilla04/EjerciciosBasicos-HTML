'use strict';

const gastos = [
  { descripcion: 'Suscripción anual de videojuegos', monto: 120, categoria: 'entretenimiento' },
  { descripcion: 'Cambio de aceite de motocicleta', monto: 75, categoria: 'transporte' },
  { descripcion: 'Almuerzo en la universidad', monto: 10, categoria: 'alimentacion' },
  { descripcion: 'Pago de internet', monto: 40, categoria: 'servicios' },
  { descripcion: 'Gasolina para la semana', monto: 20, categoria: 'transporte' },
  { descripcion: 'Curso de programación', monto: 110, categoria: 'educacion' },
  { descripcion: 'Cena con amigos', monto: 25, categoria: 'alimentacion' },
  { descripcion: 'Entrada a un concierto', monto: 60, categoria: 'entretenimiento' }
];

function calcularTotal(gastos) {
  let total = 0;

  for (let i = 0; i < gastos.length; i++) {
    if (typeof gastos[i].monto !== 'number') {
      throw new Error('El monto del gasto "' + gastos[i].descripcion + '" no es un número.');
    }
    total += gastos[i].monto;
  }

  return total;
}

function calcularPromedio(gastos) {
  if (gastos.length === 0) {
    throw new Error('No se puede calcular el promedio de una lista vacía.');
  }

  return calcularTotal(gastos) / gastos.length;
}

function filtrarPorCategoria(gastos, categoria) {
  const encontrados = [];

  for (let i = 0; i < gastos.length; i++) {
    if (gastos[i].categoria === categoria) {
      encontrados[encontrados.length] = gastos[i];
    }
  }

  return encontrados;
}

function obtenerMayorGasto(gastos) {
  if (gastos.length === 0) {
    return null;
  }

  let mayorGasto = gastos[0];

  for (let i = 1; i < gastos.length; i++) {
    if (gastos[i].monto > mayorGasto.monto) {
      mayorGasto = gastos[i];
    }
  }

  return mayorGasto;
}

function clasificarGasto(monto) {
  if (monto >= 100) {
    return 'Alto';
  } else if (monto >= 50) {
    return 'Medio';
  } else {
    return 'Bajo';
  }
}

function describirCategoria(categoria) {
  switch (categoria) {
    case 'entretenimiento':
      return 'Actividades y diversión';
    case 'transporte':
      return 'Movilidad y mantenimiento';
    case 'alimentacion':
      return 'Comidas y alimentos';
    case 'servicios':
      return 'Pagos de servicios';
    case 'educacion':
      return 'Estudios y aprendizaje';
    default:
      return 'Otra categoría';
  }
}

function crearContadorDeAltos() {
  let contador = 0;

  return function () {
    contador++;
    return contador;
  };
}

const esGastoAlto = (nivel, monto) => nivel === 'Alto' && monto >= 100;

try {
  const gastosClasificados = [];
  const contarAltos = crearContadorDeAltos();
  let cantidadAltos = 0;

  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];
    const nivel = clasificarGasto(gasto.monto);

    gastosClasificados[gastosClasificados.length] = {
      descripcion: gasto.descripcion,
      monto: gasto.monto,
      categoria: gasto.categoria,
      nivel: nivel,
      descripcionCategoria: describirCategoria(gasto.categoria)
    };

    if (esGastoAlto(nivel, gasto.monto)) {
      cantidadAltos = contarAltos();
    }
  }

  const total = calcularTotal(gastos);
  const promedio = calcularPromedio(gastos);
  const mayorGasto = obtenerMayorGasto(gastos);
  const categoriaElegida = 'transporte';
  const resumenPorCategoria = {};

  for (let i = 0; i < gastos.length; i++) {
    const categoria = gastos[i].categoria;

    if (resumenPorCategoria[categoria] === undefined) {
      resumenPorCategoria[categoria] = 0;
    }

    resumenPorCategoria[categoria] += gastos[i].monto;
  }

  console.log('Tabla de gastos clasificados:');
  console.table(gastosClasificados);
  console.log('Total gastado: $' + total.toFixed(2));
  console.log('Promedio de gastos: $' + promedio.toFixed(2));
  console.log('Gasto más alto: ' + mayorGasto.descripcion + ', $' + mayorGasto.monto.toFixed(2) + ', categoría: ' + mayorGasto.categoria);
  console.log('Cantidad de gastos altos: ' + cantidadAltos);
  console.log('Gastos de la categoría "' + categoriaElegida + '":', filtrarPorCategoria(gastos, categoriaElegida));

  const informe = {
    total: total,
    promedio: promedio,
    cantidadAltos: cantidadAltos,
    mayorGasto: mayorGasto,
    resumenPorCategoria: resumenPorCategoria
  };

  console.log('Informe final en formato JSON:');
  console.log(JSON.stringify(informe, null, 2));
} catch (error) {
  console.error('Error al procesar los gastos: ' + error.message);
}

try {
  calcularPromedio([]);
} catch (error) {
  console.error('Prueba controlada: ' + error.message);
}
