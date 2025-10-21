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
// Generar resumen
// ------------------------
document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  let resumen = "📋 RESUMEN DE RETIRO DE ANTENA\n\n";

  const camposEnOrden = [
    "fecha", "acompanante", "cliente",
    "trabajor",
    "confirmado", "nota"
  ];

  for (let campo of camposEnOrden) {
    if (campo === "trabajor") {
      const input = document.getElementById(campo);
      const label = document.querySelector(`label[for="${campo}"]`);
      const nombreCampo = label ? label.textContent.replace(":", "").trim() : campo;
      const valor = input.value.trim();
      resumen += `● ${nombreCampo}: ${valor || "No especificado"}\n`;

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

      // ------------------------
      // ¿Se retiró conector?
      // ------------------------
      

      continue; // Saltar al siguiente campo
    }

    // ------------------------
    // Campos normales
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

