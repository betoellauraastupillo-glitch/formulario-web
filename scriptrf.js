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

  let resumen = "📋 *RESUMEN DE RETIRO DE FIBRA*\n\n";

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
      const conector = document.querySelector('input[name="retiroConector"]:checked');
      if (conector) {
        if (conector.value === "Sí") {
          resumen += `● Se retiró conector: Sí\n`;
        } else {
          const motivo = document.getElementById("motivoNo").value.trim();
          resumen += `● Se retiró conector: No\n`;
          resumen += `   ○ Motivo: ${motivo || "No especificado"}\n`;
        }
      }

      continue;
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

  // ------------------------
  // Crear botón de WhatsApp
  // ------------------------
  let btnWhatsapp = document.getElementById("btnWhatsapp");
  if (!btnWhatsapp) {
    btnWhatsapp = document.createElement("button");
    btnWhatsapp.id = "btnWhatsapp";
    btnWhatsapp.className = "boton1";
    btnWhatsapp.innerHTML = '<i class="fa-brands fa-whatsapp"></i> Enviar por WhatsApp';
    btnWhatsapp.style.marginTop = "10px";
    document.getElementById("resumen-seccion").appendChild(btnWhatsapp);
  }

  // Asignar acción al botón
  btnWhatsapp.onclick = function () {
    const texto = encodeURIComponent(resumen);
    const numero = ""; // 🔹 Opcional: coloca un número fijo si deseas, ej. "51987654321"
    const url = numero
      ? `https://wa.me/${numero}?text=${texto}`
      : `https://wa.me/?text=${texto}`;
    window.open(url, "_blank");
  };

  // ------------------------
  // Mover el botón "Volver al inicio" debajo del botón de WhatsApp
  // ------------------------
  const btnInicio = document.getElementById("inicioBtn");
  document.getElementById("resumen-seccion").appendChild(btnInicio);
});


// ------------------------
// Agregar equipos retirados dinámicamente con botón eliminar (icono)
// ------------------------
document.getElementById("agregar-equipo-retirado").addEventListener("click", () => {
  const contenedor = document.getElementById("equipos-retirados-container");

  const div = document.createElement("div");
  div.className = "equipo-retirado-item";
  div.style.marginBottom = "10px";

  div.innerHTML = `
    <input type="text" class="equipo-retirado-nombre" placeholder="Nombre del equipo retirado" required>
    <button type="button" class="eliminar-equipo-retirado boton1" style="margin-left:10px;">
      <i class="fa-solid fa-trash"></i>
    </button>
  `;

  contenedor.appendChild(div);

  // Agregar evento para eliminar
  div.querySelector(".eliminar-equipo-retirado").addEventListener("click", () => {
    div.remove();
  });
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
