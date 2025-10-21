document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  let resumen = "📋 RESUMEN DEL TRASLADO DE ANTENA\n\n";

  // ------------------------
  const camposEnOrden = [
    "fecha", "acompanante", "cliente",
    "distrito", "direccion", "manzana", "lote",
    "pisos", "instaladoEn", "inquilino",
    "plan", "ip", "torre", "supresor",
    "iptv", "sistema", "confirmado", "nota"
  ];

  for (let campo of camposEnOrden) {
    if (campo === "cliente") {
      const input = document.getElementById(campo);
      const label = document.querySelector(`label[for="${campo}"]`).textContent.replace(":", "").trim();
      resumen += `● ${label}: ${input.value.trim() || "No especificado"}\n`;
      continue;
    }

    if (campo === "inquilino") {
      const seleccionado = document.querySelector('input[name="inquilino"]:checked');
      const valor = seleccionado ? seleccionado.value : "No especificado";
      resumen += `● Propietario/Inquilino: ${valor}\n`;
      continue;
    }

    if (campo === "plan") {
      // ------------------------
      // EQUIPOS INSTALADOS
      // ------------------------
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

      // ------------------------
      // EQUIPOS RETIRADOS
      // ------------------------
      resumen += `● Equipos retirados:\n`;
      const retirados = document.querySelectorAll(".equipo-retirado-item");

      if (retirados.length === 0) {
        resumen += "  No se especificaron equipos retirados\n";
      } else {
        retirados.forEach((item, i) => {
          const nombre = item.querySelector(".equipo-retirado-nombre").value || `Equipo retirado ${i + 1}`;
          resumen += `  ○ ${nombre}\n`;
        });
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
// Agregar equipos instalados dinámicamente
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
  `;

  contenedor.appendChild(div);
});

// ------------------------
// Agregar equipos retirados dinámicamente
// ------------------------
document.getElementById("agregar-equipo-retirado").addEventListener("click", () => {
  const contenedor = document.getElementById("equipos-retirados-container");

  const div = document.createElement("div");
  div.className = "equipo-retirado-item";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <input type="text" class="equipo-retirado-nombre" placeholder="Nombre del equipo retirado" required>
  `;

  contenedor.appendChild(div);
});

// ------------------------
// Poner todos los campos como requeridos automáticamente
// ------------------------
window.addEventListener("DOMContentLoaded", function () {
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
