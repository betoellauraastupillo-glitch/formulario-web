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
    "celular", "correo", "distrito", "direccion", "manzana", "lote",
    "pisos", "instaladoEn", "inquilino",
    // Equipos se insertarán aquí
    "plan", "ip", "caja", "puerto", "supresor",
    "pago", "tipopago", "contrato", "iptv",
    "sistema", "confirmado","nota"
  ];

  for (let campo of camposEnOrden) {
    if (campo === "cliente") {
      const input = document.getElementById(campo);
      const label = document.querySelector(`label[for="${campo}"]`).textContent.replace(":", "").trim();
      resumen += `● ${label}: ${input.value.trim() || "No especificado"}\n`;

      // Insertar aquí el documento
      resumen += `● Documento: ${tipoFinal} - ${numeroDocumento}\n`;
      continue;
    }

    if (campo === "inquilino") {
      const seleccionado = document.querySelector('input[name="inquilino"]:checked');
      const valor = seleccionado ? seleccionado.value : "No especificado";
      resumen += `● Propietario/Inquilino: ${valor}\n`;
      continue;
    }

    if (campo === "plan") {
      // Insertar aquí los equipos
      resumen += `● Equipos instalados:\n`;
      const items = document.querySelectorAll(".equipo-item");

      if (items.length === 0) {
        resumen += "  No se especificaron equipos\n";
      } else {
        let errorEquipos = false;
        items.forEach((item, i) => {
          const nombre = item.querySelector(".equipo-nombre").value || `Equipo ${i + 1}`;
          const estadoInput = item.querySelector("input.equipo-estado:checked");

          if (!estadoInput) {
            alert(`Debes seleccionar si el equipo "${nombre}" es nuevo o usado.`);
            errorEquipos = true;
            return;
          }

          const estado = estadoInput.value;
          resumen += `  ○ ${nombre}     ${estado}\n`;
        });
        if (errorEquipos) return;
      }
    }

    const input = document.getElementById(campo);
    if (!input) continue;
    const label = document.querySelector(`label[for="${campo}"]`);
    const nombreCampo = label ? label.textContent.replace(":", "").trim() : campo;
    const valor = input.value.trim();
    resumen += `● ${nombreCampo}: ${valor || "No especificado"}\n`;
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


