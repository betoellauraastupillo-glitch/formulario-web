document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  let resumen = "📋 RESUMEN DE INSTALACIÓN DE FIBRA\n\n";

  // ------------------------
  // 1. Documento
  // ------------------------
  const tipoDoc = document.getElementById("tipoDocumento").value;
  let tipoFinal = "", numeroDocumento = "";

  if (!tipoDoc) {
    alert("Seleccione el tipo de documento.");
    return;
  }

  if (tipoDoc === "dni") {
    numeroDocumento = document.getElementById("dni").value.trim();
    if (!numeroDocumento) {
      alert("Ingrese el número de DNI.");
      return;
    }
    tipoFinal = "DNI";
  } else if (tipoDoc === "ce") {
    numeroDocumento = document.getElementById("numeroAlternativo").value.trim();
    if (!numeroDocumento) {
      alert("Ingrese el número del carné de extranjería.");
      return;
    }
    tipoFinal = "Carné de extranjería";
  } else if (tipoDoc === "pasaporte") {
    numeroDocumento = document.getElementById("numeroAlternativo").value.trim();
    if (!numeroDocumento) {
      alert("Ingrese el número del pasaporte.");
      return;
    }
    tipoFinal = "Pasaporte";
  } else if (tipoDoc === "otro") {
    const otro = document.getElementById("otroTipo").value.trim();
    if (!otro) {
      alert("Especifique el tipo de documento.");
      return;
    }
    numeroDocumento = document.getElementById("numeroAlternativo").value.trim();
    if (!numeroDocumento) {
      alert("Ingrese el número del documento.");
      return;
    }
    tipoFinal = otro;
  }

  // ------------------------
  // 2. Campos normales (en orden del HTML)
  // ------------------------
  const camposEnOrden = [
    "fecha", "acompanante", "cliente",
    // Documento se insertará aquí
   "correo", "distrito", "direccion","calle", "manzana", "lote","numeroCasa",
    "pisos", "instaladoEn", "inquilino",
    // Equipos se insertarán aquí
    "plan", "ip", "caja", "puerto", "supresor",
    "pago", "tipopago", "contrato", "iptv",
    "sistema", "confirmado","nota"
  ];
  
for (let campo of camposEnOrden) {

  // ------------------------
  // CLIENTE + DOCUMENTO + CELULARES
  // ------------------------
  if (campo === "cliente") {

    const input = document.getElementById(campo);
    const label = document.querySelector(`label[for="${campo}"]`).textContent.replace(":", "").trim();

    resumen += `● ${label}: ${input.value.trim() || "No especificado"}\n`;
    resumen += `● Documento: ${tipoFinal} - ${numeroDocumento}\n`;

    // celulares
    const celulares = document.querySelectorAll(".celular-numero");
    let lista = [];

    celulares.forEach(c => {
      if (c.value.trim()) lista.push(c.value.trim());
    });

    resumen += `● Celular: ${lista.length ? lista.join(" / ") : "No especificado"}\n`;

    continue;
  }

  // ------------------------
  // INQUILINO
  // ------------------------
  if (campo === "inquilino") {
    const seleccionado = document.querySelector('input[name="inquilino"]:checked');
    resumen += `● Propietario/Inquilino: ${seleccionado ? seleccionado.value : "No especificado"}\n`;
    continue;
  }

  // ------------------------
  // EQUIPOS
  // ------------------------
  if (campo === "plan") {
    resumen += `● Equipos instalados:\n`;

    const items = document.querySelectorAll(".equipo-item");

    if (items.length === 0) {
      resumen += "  No se especificaron equipos\n";
    } else {
      items.forEach((item, i) => {
        const nombre = item.querySelector(".equipo-nombre").value || `Equipo ${i + 1}`;
        const estado = item.querySelector("input.equipo-estado:checked");

        if (estado) {
          resumen += `  ○ ${nombre}     ${estado.value}\n`;
        }
      });
    }
  }

  // ------------------------
  // IPTV + EXTRAS (JUSTO DEBAJO)
  // ------------------------
  if (campo === "iptv") {

    const input = document.getElementById(campo);
    const label = document.querySelector(`label[for="${campo}"]`);
    const nombre = label ? label.textContent.replace(":", "").trim() : campo;

    resumen += `● ${nombre}: ${input.value.trim() || "No especificado"}\n`;

    // extras
    const extras = document.querySelectorAll(".extra-item");

    if (extras.length > 0) {
      resumen += `● Información adicional:\n`;

      extras.forEach(extra => {
        const titulo = extra.querySelector(".extra-titulo").value.trim();
        const dato = extra.querySelector(".extra-dato").value.trim();

        if (titulo || dato) {
          resumen += `  ○ ${titulo || "Dato"}: ${dato || "No especificado"}\n`;
        }
      });
    }

    continue; // 👈 importante
  }

  // ------------------------
  // RESTO DE CAMPOS (NORMAL)
  // ------------------------
  const input = document.getElementById(campo);
  if (!input) continue;

  const label = document.querySelector(`label[for="${campo}"]`);
  const nombre = label ? label.textContent.replace(":", "").trim() : campo;

  resumen += `● ${nombre}: ${input.value.trim() || "No especificado"}\n`;
}



  // ------------------------
  // Mostrar resumen
  // ------------------------
  document.getElementById("resumen-texto").textContent = resumen;
  document.getElementById("formulario-seccion").style.display = "none";
  document.getElementById("resumen-seccion").style.display = "block";
});


// Mostrar/ocultar campos según tipo de documento
function actualizarDocumento() {
  const tipo = document.getElementById("tipoDocumento").value;

  const campoDNI = document.getElementById("campoDNI");
  const documentoAlternativo = document.getElementById("documentoAlternativo");
  const campoOtroTipo = document.getElementById("campoOtroTipo");

  campoDNI.style.display = (tipo === "dni") ? "block" : "none";
  documentoAlternativo.style.display = (tipo !== "dni") ? "block" : "none";
  campoOtroTipo.style.display = (tipo === "otro") ? "block" : "none";

  // Reset all required
  document.getElementById("dni").required = false;
  document.getElementById("numeroAlternativo").required = false;
  document.getElementById("otroTipo").required = false;

  // Set required only for visible/selected fields
  if (tipo === "dni") {
    document.getElementById("dni").required = true;
  } else {
    document.getElementById("numeroAlternativo").required = true;
    if (tipo === "otro") {
      document.getElementById("otroTipo").required = true;
    }
  }
}


// Botón copiar resumen
document.getElementById("copiarBtn").addEventListener("click", () => {
  const texto = document.getElementById("resumen-texto").textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert("Resumen copiado al portapapeles.");
  });
});

// Botón volver al inicio
document.getElementById("inicioBtn").addEventListener("click", () => {
  location.reload();
});

// ------------------------
// Agregar equipos instalados dinámicamente con botón eliminar (icono)
// ------------------------
document.getElementById("agregar-equipo").addEventListener("click", () => {
  const contenedor = document.getElementById("equipos-container");
  const index = contenedor.children.length;

  const div = document.createElement("div");
  div.className = "equipo-item";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <input type="text" class="equipo-nombre" placeholder="Nombre del equipo" required>
    <label style="margin-left:10px;">
      <input type="radio" name="estado-${index}" value="nuevo" class="equipo-estado" required> Nuevo
    </label>
    <label style="margin-left:10px;">
      <input type="radio" name="estado-${index}" value="usado" class="equipo-estado" required> Usado
    </label>
    <button type="button" class="eliminar-equipo boton1" style="margin-left:10px;">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  contenedor.appendChild(div);

  // Agregar evento para eliminar
  div.querySelector(".eliminar-equipo").addEventListener("click", () => {
    div.remove();
  });
});
// ------------------------
// Celulares dinámicos
// ------------------------
document.getElementById("agregar-celular").addEventListener("click", () => {

  const contenedor = document.getElementById("celulares-container");

  const div = document.createElement("div");
  div.className = "celular-item";
  div.style.marginTop = "10px";

  div.innerHTML = `
    <input type="tel" class="celular-numero" placeholder="Número de celular">

    <button type="button" class="eliminar-celular boton1">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  contenedor.appendChild(div);

  div.querySelector(".eliminar-celular").addEventListener("click", () => {
    div.remove();
  });

});
// ------------------------
// Campos adicionales dinámicos
// ------------------------
document.getElementById("agregar-extra").addEventListener("click", () => {

  const contenedor = document.getElementById("extras-container");

  const div = document.createElement("div");
  div.className = "extra-item";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <input type="text" class="extra-titulo" placeholder="Título (Ej: RUC)" required>
    <input type="text" class="extra-dato" placeholder="Dato o descripción" required>

    <button type="button" class="eliminar-extra boton1">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  contenedor.appendChild(div);

  div.querySelector(".eliminar-extra").addEventListener("click", () => {
    div.remove();
  });

});

window.addEventListener("DOMContentLoaded", function () {
  actualizarDocumento();

  const campos = document.querySelectorAll("#formulario input, #formulario select, #formulario textarea");

  campos.forEach(function (campo) {
    if (
      campo.type !== "button" &&
      campo.type !== "submit" &&
      campo.type !== "reset" &&
      campo.type !== "hidden" &&
      !campo.disabled
    ) {
      campo.required = true;
    }
  });
});


