//GUARDAR DATOS + EJEMPLOS
let guardado = localStorage.getItem("gastos");
let gastos = guardado
  ? JSON.parse(guardado)
  : [
      { categoria: "Comida", descripcion: "Pan", monto: 2500 },
      { categoria: "Transporte", descripcion: "Metro", monto: 3200 },
      { categoria: "Ocio", descripcion: "Cine", monto: 5000 },
      { categoria: "Comida", descripcion: "Almuerzo", monto: 8500 },
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
  let filtrados = gastos.filter((gasto) => gasto.categoria === categoria);
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
        alert("Total gastado: " + totalGastos(gastos));
        break;

      case "2":
        alert("Promedio por gasto: " + promedioGastos(gastos));
        break;

      case "3":
        let categoria = prompt(
          "Seleccione una categoría: (comida,transporte,ocio)",
        );
        //SI NO EXISTE LA CATEGORÍA
        let existe = gastos.some((gasto) => gasto.categoria === categoria);
        if (existe) {
          alert(
            "Total de " +
              categoria +
              ": " +
              gastosPorCategoria(gastos, categoria),
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
let btnAgregar = document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", function () {
  let categoria = inputCategoria.value;
  let descripcion = document.getElementById("inputDescripcion").value;
  let monto = Number(inputMonto.value);
  if (categoria === "") {
    alert("Categoría vacía");
    return;
  }

  if (isNaN(monto) || monto <= 0) {
    alert("El monto debe ser mayor que 0.");
    return;
  }
  gastos.push({ categoria: categoria, descripcion: descripcion, monto: monto });
  mostrarGastos();
  mostrarResumen();
  guardarGastos();

  //DEJAR CAMPOS VACÍOS PARA AGREGAR OTRO
  inputCategoria.value = "";
  document.getElementById("inputDescripcion").value = "";
  inputMonto.value = "";

  //VOLVER A ESCRIBIR SIN PONER EL CURSOS DE VUELTA
  inputCategoria.focus();
});

//AGREGAR GASTOS
let listaGastos = document.getElementById("listaGastos");

function mostrarGastos() {
  if (gastos.length === 0) {
    listaGastos.innerHTML =
      "<tr><td colspan='4' class='text-center text-muted'>No hay gastos registrados.</td></tr>";
    return;
  }
  let html = "";

  for (let index = 0; index < gastos.length; index++) {
    const gasto = gastos[index];
    html +=
      "<tr>" +
      "<td>" +
      gasto.categoria +
      "</td>" +
      "<td>" +
      gasto.descripcion +
      "</td>" +
      "<td class='text-end'>$" +
      gasto.monto +
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
  totalGastado.textContent = totalGastos(gastos);
  promedioGasto.textContent = promedioGastos(gastos);
  document.getElementById("categoriaConMasGasto").textContent =
    categoriasConMasGasto(gastos);
}

mostrarGastos();
mostrarResumen();

//MENSAJE DE BIENVENIDA
function darBienvenida() {
  let nombre = prompt("¡Hola! 🎀 ¿Cómo te llamas?");

  if (nombre === null || nombre.trim() === "") {
    nombre = "amiga"; // si no escribe nada, saludo genérico
  }

  alert(
    "¡Bienvenida, " +
      nombre +
      "! 💖\n\n" +
      "Esta es tu app de Control de Gastos.\n" +
      "Agrega tus gastos, mira tu total y promedio. 🌸",
  );

  //Después de saludar, abre el menú de opciones
  menu();
}

darBienvenida();

//AGREGAR CON LA TECLA ENTER
inputMonto.addEventListener("keydown", function (evento) {
  if (evento.key === "Enter") {
    btnAgregar.click();
  }
});
