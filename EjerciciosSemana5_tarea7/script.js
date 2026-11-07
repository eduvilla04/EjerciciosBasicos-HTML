'use strict';

let inventario = [
  { id: 1, nombre: 'Cuaderno universitario', categoria: 'Papelería', cantidad: 15, precio: 2.50, agotado: false },
  { id: 2, nombre: 'Lapicero azul', categoria: 'Papelería', cantidad: 30, precio: 0.75, agotado: false },
  { id: 3, nombre: 'Memoria USB 64 GB', categoria: 'Tecnología', cantidad: 8, precio: 9.99, agotado: false },
  { id: 4, nombre: 'Mouse inalámbrico', categoria: 'Tecnología', cantidad: 4, precio: 18.50, agotado: false },
  { id: 5, nombre: 'Botella reutilizable', categoria: 'Accesorios', cantidad: 12, precio: 6.75, agotado: false },
  { id: 6, nombre: 'Mochila negra', categoria: 'Accesorios', cantidad: 0, precio: 28.99, agotado: true },
  { id: 7, nombre: 'Carpeta plástica', categoria: 'Papelería', cantidad: 20, precio: 1.50, agotado: false },
  { id: 8, nombre: 'Audífonos con cable', categoria: 'Tecnología', cantidad: 6, precio: 12.75, agotado: false }
];

const formulario = document.querySelector('#formulario-producto');
const cuerpoInventario = document.getElementById('cuerpo-inventario');
const filtroCategoria = document.getElementById('filtro-categoria');
const mensajeError = document.getElementById('mensaje-error');
const mensajeVacio = document.getElementById('mensaje-vacio');

function crearGeneradorId() {
  let contador = 99;

  return function () {
    contador++;
    return contador;
  };
}

function calcularValorTotal(items) {
  let total = 0;

  for (let i = 0; i < items.length; i++) {
    total += items[i].cantidad * items[i].precio;
  }

  return total;
}

function contarUnidades(items) {
  let unidades = 0;

  for (let i = 0; i < items.length; i++) {
    unidades += items[i].cantidad;
  }

  return unidades;
}

function contarPorCategoria(items) {
  const cantidades = {};

  for (let i = 0; i < items.length; i++) {
    const categoria = items[i].categoria;

    if (cantidades[categoria] === undefined) {
      cantidades[categoria] = 0;
    }

    cantidades[categoria]++;
  }

  return cantidades;
}

function crearCelda(texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  return celda;
}

function crearFila(item) {
  const fila = document.createElement('tr');
  fila.classList.toggle('fila-agotada', item.agotado);

  fila.appendChild(crearCelda(item.nombre));
  fila.appendChild(crearCelda(item.categoria));
  fila.appendChild(crearCelda(item.cantidad));
  fila.appendChild(crearCelda('$' + item.precio.toFixed(2)));
  fila.appendChild(crearCelda('$' + (item.cantidad * item.precio).toFixed(2)));

  const celdaEstado = crearCelda(item.agotado ? 'Agotado' : 'Disponible');
  celdaEstado.classList.add(item.agotado ? 'estado-agotado' : 'estado-disponible');
  fila.appendChild(celdaEstado);

  const celdaAcciones = document.createElement('td');
  celdaAcciones.classList.add('acciones-tabla');

  const botonEstado = document.createElement('button');
  botonEstado.type = 'button';
  botonEstado.classList.add('btn-estado');
  botonEstado.setAttribute('data-id', item.id);
  botonEstado.textContent = 'Cambiar estado';

  const botonEliminar = document.createElement('button');
  botonEliminar.type = 'button';
  botonEliminar.classList.add('btn-eliminar');
  botonEliminar.setAttribute('data-id', item.id);
  botonEliminar.textContent = 'Eliminar';

  celdaAcciones.appendChild(botonEstado);
  celdaAcciones.appendChild(botonEliminar);
  fila.appendChild(celdaAcciones);

  return fila;
}

function renderizar(items) {
  cuerpoInventario.replaceChildren();

  for (let i = 0; i < items.length; i++) {
    cuerpoInventario.appendChild(crearFila(items[i]));
  }

  // El resumen usa solo los productos que se ven con el filtro.
  document.querySelector('#total-productos').textContent = items.length;
  document.querySelector('#total-unidades').textContent = contarUnidades(items);
  document.querySelector('#valor-total').textContent = '$' + calcularValorTotal(items).toFixed(2);

  let agotados = 0;
  for (let i = 0; i < items.length; i++) {
    if (items[i].agotado) {
      agotados++;
    }
  }

  document.querySelector('#total-agotados').textContent = agotados;
  mensajeVacio.hidden = items.length !== 0;
}

function filtrarPorCategoria(categoria) {
  const resultados = [];

  for (let i = 0; i < inventario.length; i++) {
    if (categoria === 'todas' || inventario[i].categoria === categoria) {
      resultados[resultados.length] = inventario[i];
    }
  }

  return resultados;
}

function validarProducto(datos) {
  if (datos.nombre.trim() === '') {
    throw new Error('Escribí el nombre del producto.');
  }

  if (datos.categoria.trim() === '') {
    throw new Error('Escribí la categoría del producto.');
  }

  if (!Number.isInteger(datos.cantidad) || datos.cantidad <= 0) {
    throw new Error('La cantidad debe ser un número entero mayor que cero.');
  }

  if (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio) || datos.precio < 0) {
    throw new Error('El precio debe ser un número mayor o igual que cero.');
  }
}

function agregarProducto(event) {
  event.preventDefault();

  try {
    const nombre = document.querySelector('#nombre').value.trim();
    const categoria = document.querySelector('#categoria').value.trim();
    const textoCantidad = document.querySelector('#cantidad').value;
    const textoPrecio = document.querySelector('#precio').value;

    const datos = {
      nombre: nombre,
      categoria: categoria,
      cantidad: textoCantidad === '' ? NaN : Number(textoCantidad),
      precio: textoPrecio === '' ? NaN : Number(textoPrecio)
    };

    validarProducto(datos);

    const nuevoProducto = {
      id: generarId(),
      nombre: datos.nombre,
      categoria: datos.categoria,
      cantidad: datos.cantidad,
      precio: datos.precio,
      agotado: false
    };

    inventario[inventario.length] = nuevoProducto;
    mensajeError.hidden = true;
    mensajeError.textContent = '';
    formulario.reset();
    actualizarCategorias();
    filtroCategoria.value = 'todas';
    mostrarInventario();

    console.log('Producto agregado:', nuevoProducto.nombre, '| ID:', nuevoProducto.id);
  } catch (error) {
    mensajeError.textContent = error.message;
    mensajeError.hidden = false;
    console.error('No se pudo agregar el producto: ' + error.message);
  }
}

function eliminarProducto(id) {
  const productosRestantes = [];

  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id !== id) {
      productosRestantes[productosRestantes.length] = inventario[i];
    }
  }

  return productosRestantes;
}

function cambiarEstado(id) {
  for (let i = 0; i < inventario.length; i++) {
    if (inventario[i].id === id) {
      inventario[i].agotado = !inventario[i].agotado;
      return;
    }
  }
}

function actualizarCategorias() {
  const seleccionAnterior = filtroCategoria.value;
  filtroCategoria.replaceChildren();

  const opcionTodas = document.createElement('option');
  opcionTodas.value = 'todas';
  opcionTodas.textContent = 'Todas';
  filtroCategoria.appendChild(opcionTodas);

  const categorias = Object.keys(contarPorCategoria(inventario));

  for (let i = 0; i < categorias.length; i++) {
    const opcion = document.createElement('option');
    opcion.value = categorias[i];
    opcion.textContent = categorias[i];
    filtroCategoria.appendChild(opcion);
  }

  let categoriaExiste = false;
  for (let i = 0; i < categorias.length; i++) {
    if (categorias[i] === seleccionAnterior) {
      categoriaExiste = true;
    }
  }

  if (seleccionAnterior !== 'todas' && !categoriaExiste) {
    const opcion = document.createElement('option');
    opcion.value = seleccionAnterior;
    opcion.textContent = seleccionAnterior;
    filtroCategoria.appendChild(opcion);
  }

  filtroCategoria.value = seleccionAnterior || 'todas';
}

function mostrarInventario() {
  const productosVisibles = filtrarPorCategoria(filtroCategoria.value);
  renderizar(productosVisibles);
}

const generarId = crearGeneradorId();

actualizarCategorias();
mostrarInventario();

formulario.addEventListener('submit', agregarProducto);

filtroCategoria.addEventListener('change', mostrarInventario);

cuerpoInventario.addEventListener('click', function (event) {
  const boton = event.target.closest('button');

  if (!boton || !cuerpoInventario.contains(boton)) {
    return;
  }

  const id = Number(boton.getAttribute('data-id'));

  if (boton.classList.contains('btn-eliminar')) {
    inventario = eliminarProducto(id);
    actualizarCategorias();
    mostrarInventario();
    console.log('Producto eliminado. ID:', id);
  } else if (boton.classList.contains('btn-estado')) {
    cambiarEstado(id);
    mostrarInventario();
    console.log('Estado actualizado. ID:', id);
  }
});

console.log('Inventario inicial:');
console.table(inventario);
console.log('Cantidad de productos por categoría:');
console.table(contarPorCategoria(inventario));
