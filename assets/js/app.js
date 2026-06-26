//GUARDAR DATOS + EJEMPLOS
let guardado = localStorage.getItem("gastos");

let gastos = guardado
  ? JSON.parse(guardado)
  : [
      { categoria: "Comida", descripcion: "Pan", monto: 2500, fecha: "2026-04" },
      { categoria: "Transporte", descripcion: "Metro", monto: 3200, fecha: "2026-05" },
      { categoria: "Ocio", descripcion: "Cine", monto: 5000, fecha: "2026-06" },
      { categoria: "Comida", descripcion: "Almuerzo", monto: 8500, fecha: "2026-06" },
    ];

//SUMA DE GASTOS
function totalGastos(gastos = []) {
  let total = 0;
  for (const gasto of gastos) {
    total += gasto.monto;
  }
  return total;
}

//PROMEDIO DE GASTOS
function promedioGastos(gastos = []) {
  if (gastos.length === 0) return 0;
  let total = totalGastos(gastos);
  let promedio = total / gastos.length;
  return promedio;
}

//GASTOS POR CATEGORÍA
function gastosPorCategoria(gastos = [], categoria) {
  let filtrados = gastos.filter(
    (gasto) => gasto.categoria.toLowerCase() === categoria.toLowerCase(),
  );
  let total = totalGastos(filtrados);

  return total;
}

//CATEGORÍAS SIN REPETICIÓN
function categoriasUnicas(gastos) {
  let lista = [];

  for (const gasto of gastos) {
    if (!lista.includes(gasto.categoria)) {
      lista.push(gasto.categoria);
    }
  }
  return lista;
}

//CATEGORÍA DÓNDE MÁS SE GASTA
function categoriasConMasGasto(gastos) {
  let categorias = categoriasUnicas(gastos);

  let categoriaGanadora = "";
  let montoGanador = 0;

  for (const categoria of categorias) {
    let totalCategoria = gastosPorCategoria(gastos, categoria);
    if (totalCategoria > montoGanador) {
      montoGanador = totalCategoria;
      categoriaGanadora = categoria;
    }
  }
  return categoriaGanadora;
}

//MENÚ DE CONSOLA — SWITCH + WHILE + PROMPT
function menu() {
  let continuar = true;

  while (continuar) {
    let mensaje =
      "Control de Gastos\n" +
      "1. Ver total gastado.\n" +
      "2. Ver promedio por gasto.\n" +
      "3. Ver total por categoría.\n\n" +
      "(Cancela o deja vacío para ir directo a la app)";

    let opcion = prompt(mensaje);

    switch (opcion) {
      case "1":
        alert("Total gastado: " + formatearMonto(totalGastos(gastos)));
        break;

      case "2":
        alert(
          "Promedio por gasto: " +
            formatearMonto(Math.round(promedioGastos(gastos))),
        );
        break;

      case "3":
        let categoria = prompt(
          "Seleccione una categoría: (comida,transporte,ocio)",
        );
        //SI NO EXISTE LA CATEGORÍA
        let existe = gastos.some(
          (gasto) => gasto.categoria.toLowerCase() === categoria.toLowerCase(),
        );
        if (existe) {
          alert(
            "Total de " +
              categoria +
              ": " +
              formatearMonto(gastosPorCategoria(gastos, categoria)),
          );
        } else {
          alert('La categoría "' + categoria + '" no existe.');
        }
        break;

      default:
        //Cancelar, vacío o cualquier opción inválida cierra el menú y te deja en la app
        continuar = false;
        break;
    }
  }
}

//VALUE
let inputCategoria = document.getElementById("inputCategoria");
let inputMonto = document.getElementById("inputMonto");
let inputFecha = document.getElementById("inputFecha");
let btnAgregar = document.getElementById("btnAgregar");

//AL CARGAR, DEJAR LA FECHA DE HOY PUESTA
inputFecha.value = hoyISO();

//PONER LA PRIMERA LETRA EN MAYÚSCULA
function capitalizar(texto) {
  texto = texto.trim();
  if (texto === "") return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

//FORMATO DE MONTO EN PESOS CHILENOS ($2.500)
function formatearMonto(numero) {
  return "$" + numero.toLocaleString("es-CL");
}

//MES ACTUAL EN FORMATO yyyy-mm (para el input de mes)
function hoyISO() {
  let hoy = new Date();
  let anio = hoy.getFullYear();
  let mes = String(hoy.getMonth() + 1).padStart(2, "0");
  return anio + "-" + mes;
}

//PASAR FECHA yyyy-mm (o yyyy-mm-dd) A mm/aaaa PARA MOSTRAR
function formatearFecha(iso) {
  if (!iso) return "-";
  let partes = iso.split("-");
  if (partes.length < 2) return iso;
  return partes[1] + "/" + partes[0];
}

btnAgregar.addEventListener("click", function () {
  let categoria = capitalizar(inputCategoria.value);
  let descripcion = capitalizar(document.getElementById("inputDescripcion").value);
  let monto = Number(inputMonto.value);
  let fecha = inputFecha.value || hoyISO();
  if (categoria === "") {
    alert("Categoría vacía");
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    alert("El monto debe ser mayor que 0.");
    return;
  }
  gastos.push({
    categoria: categoria,
    descripcion: descripcion,
    monto: monto,
    fecha: fecha,
  });
  mostrarGastos();
  mostrarResumen();
  guardarGastos();

  //DEJAR CAMPOS VACÍOS PARA AGREGAR OTRO
  inputCategoria.value = "";
  document.getElementById("inputDescripcion").value = "";
  inputMonto.value = "";
  inputFecha.value = hoyISO();

  //VOLVER A ESCRIBIR SIN PONER EL CURSOS DE VUELTA
  inputCategoria.focus();
});

//AGREGAR GASTOS
let listaGastos = document.getElementById("listaGastos");

function mostrarGastos() {
  if (gastos.length === 0) {
    listaGastos.innerHTML =
      "<tr><td colspan='5' class='text-center text-muted'>No hay gastos registrados.</td></tr>";
    return;
  }
  let html = "";

  for (let index = 0; index < gastos.length; index++) {
    const gasto = gastos[index];
    html +=
      "<tr>" +
      "<td>" +
      formatearFecha(gasto.fecha) +
      "</td>" +
      "<td>" +
      gasto.categoria +
      "</td>" +
      "<td>" +
      gasto.descripcion +
      "</td>" +
      "<td class='text-end'>" +
      formatearMonto(gasto.monto) +
      "</td>" +
      "<td class='text-end'>" +
      "<button onclick='eliminarGasto(" +
      index +
      ")' class='btn btn-sm btn-outline-danger'>🗑️</button>" +
      "</td>" +
      "</tr>";
  }

  listaGastos.innerHTML = html;
}
//GUARDAR UN GASTO
function guardarGastos() {
  localStorage.setItem("gastos", JSON.stringify(gastos));
}
//ELIMINAR UN GASTO
function eliminarGasto(index) {
  gastos.splice(index, 1);
  mostrarGastos();
  mostrarResumen();
  guardarGastos();
}
//TOTAL Y PROMEDIO EN PANTALLA
let totalGastado = document.getElementById("totalGastado");
let promedioGasto = document.getElementById("promedioGasto");

function mostrarResumen() {
  totalGastado.textContent = formatearMonto(totalGastos(gastos));
  let pGastos = promedioGastos(gastos);

  promedioGasto.textContent = formatearMonto(Math.round(pGastos));
  document.getElementById("categoriaConMasGasto").textContent =
    categoriasConMasGasto(gastos);
}

mostrarGastos();
mostrarResumen();

//MENSAJE DE BIENVENIDA
function darBienvenida() {
  //Si ya saludamos antes (el nombre está guardado), no insistir al recargar
  if (localStorage.getItem("nombre") !== null) {
    return;
  }

  let nombre = prompt("¡Hola! 🎀 ¿Cómo te llamas?");

  if (nombre === null || nombre.trim() === "") {
    nombre = "amig@"; // si cancela o no escribe nada, saludo genérico
  }

  //Guardamos el nombre para no volver a preguntar la próxima vez
  localStorage.setItem("nombre", nombre);

  alert(
    "¡Bienvenid@, " +
      nombre +
      "! 💖\n\n" +
      "Esta es tu app de Control de Gastos.\n" +
      "Agrega tus gastos, mira tu total y promedio. 🌸",
  );

  //Después de saludar, abre el menú de opciones (solo esta primera vez)
  menu();
}

darBienvenida();

//AGREGAR CON LA TECLA ENTER
inputMonto.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    btnAgregar.click();
  }
});
