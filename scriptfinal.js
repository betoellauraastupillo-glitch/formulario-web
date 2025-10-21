// ------------------------
// Controlar campo "¿Se retiró conector?"
// ------------------------
document.querySelectorAll('input[name="retiroConector"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const motivoContainer = document.getElementById("motivoNoContainer");
    const motivoInput = document.getElementById("motivoNo");

    if (this.value === "No") {
      motivoContainer.style.display = "block";
      motivoInput.setAttribute("required", "true");
    } else {
      motivoContainer.style.display = "none";
      motivoInput.value = "";
      motivoInput.removeAttribute("required");
    }
  });
});

// ------------------------
// Función para convertir hora a formato 12h con AM/PM
// ------------------------
function formatoHora12(hora24) {
  if (!hora24) return "No especificada";
  const [horas, minutos] = hora24.split(":");
  const h = parseInt(horas);
  const ampm = h >= 12 ? "PM" : "AM";
  const hora12 = h % 12 || 12;
  return `${hora12}:${minutos} ${ampm}`;
}

// ------------------------
// Generar resumen
// ------------------------
document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  let resumen = "📋 REPORTE FINAL\n\n";

  const camposEnOrden = [
    "fecha",
    "monto",
    "monto2",
    "horaIngreso",
    "horaSalida",
    "nota"
  ];

  for (let campo of camposEnOrden) {
    if (campo === "fecha") {
      const input = document.getElementById(campo);
      const label = document.querySelector(`label[for="${campo}"]`);
      const nombreCampo = label ? label.textContent.replace(":", "").trim() : campo;
      const valor = input.value.trim();
      resumen += `● ${nombreCampo}: ${valor || "No especificado"}\n`;

      // ------------------------
      // EQUIPOS RETIRADOS
      // ------------------------
      resumen += `● Trabajos realizados:\n`;
      const retirados = document.querySelectorAll(".equipo-retirado-item");

      if (retirados.length === 0) {
        resumen += "  No se especificaron equipos retirados\n";
      } else {
        retirados.forEach((item, i) => {
          const nombre = item.querySelector(".equipo-retirado-nombre").value || `Equipo retirado ${i + 1}`;
          resumen += `  ○ ${nombre}\n`;
        });
      }

      continue;
    }

    // ------------------------
    // GASTO GENERADO + DETALLE
    // ------------------------
    if (campo === "monto") {
      const monto = document.getElementById("monto").value;
      const detalle = document.getElementById("explicacion").value;
      resumen += `● Gasto generado: S/ ${monto || "0.00"} — ${detalle || "Sin detalle"}\n`;
      continue;
    }

    // ------------------------
    // TOTAL RECAUDADO + DETALLE
    // ------------------------
    if (campo === "monto2") {
      const monto2 = document.getElementById("monto2").value;
      const detalle2 = document.getElementById("explicacion2").value;
      resumen += `● Total recaudado: S/ ${monto2 || "0.00"} — ${detalle2 || "Sin detalle"}\n`;
      continue;
    }

    // ------------------------
    // Hora de ingreso
    // ------------------------
    if (campo === "horaIngreso") {
      const valor = document.getElementById("horaIngreso").value;
      resumen += `● Hora de ingreso: ${formatoHora12(valor)}\n`;
      continue;
    }

    // ------------------------
    // Hora de salida
    // ------------------------
    if (campo === "horaSalida") {
      const valor = document.getElementById("horaSalida").value;
      resumen += `● Hora de salida: ${formatoHora12(valor)}\n`;
      continue;
    }

    // ------------------------
    // Campos normales (nota u otros)
    // ------------------------
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
// Botón copiar resumen
// ------------------------
document.getElementById("copiarBtn").addEventListener("click", () => {
  const texto = document.getElementById("resumen-texto").textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert("Resumen copiado al portapapeles.");
  });
});

// ------------------------
// Botón volver al inicio
// ------------------------
document.getElementById("inicioBtn").addEventListener("click", () => {
  location.reload();
});
