document.addEventListener("DOMContentLoaded", function () {
  // ------------------------
  // Enviar formulario
  // ------------------------
  document.getElementById("formulario").addEventListener("submit", function (event) {
    event.preventDefault();

    let resumen = "📋 RESUMEN DE LA EMIGRACIÓN\n\n";

    const camposEnOrden = [
      "fecha", "acompanante", "cliente",
      "plan", "ip", "torre", "supresor",
      "iptv", "sistema", "confirmado", "nota"
    ];

    for (let campo of camposEnOrden) {
      if (campo === "plan") {
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
            resumen += `  ○ ${nombre} (${estado})\n`;
          });
          if (errorEquipos) return;
        }

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

    document.getElementById("resumen-texto").textContent = resumen;
    document.getElementById("formulario-seccion").style.display = "none";
    document.getElementById("resumen-seccion").style.display = "block";
  });

  // ------------------------
  // Copiar resumen
  // ------------------------
  document.getElementById("copiarBtn").addEventListener("click", () => {
    const texto = document.getElementById("resumen-texto").textContent;
    navigator.clipboard.writeText(texto).then(() => {
      alert("Resumen copiado al portapapeles.");
    });
  });

  // ------------------------
  // Volver al inicio
  // ------------------------
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
// Botón enviar por WhatsApp
// ------------------------
document.getElementById("whatsappBtn").addEventListener("click", () => {
  const texto = document.getElementById("resumen-texto").textContent;

  // Número de destino (puedes dejarlo vacío para que el usuario elija el chat)
  const numero = ""; // Ejemplo: "51987654321"

  // Codificar el texto para la URL
  const mensaje = encodeURIComponent(texto);

  // Armar el enlace de WhatsApp
  const enlace = numero
    ? `https://wa.me/${numero}?text=${mensaje}`
    : `https://wa.me/?text=${mensaje}`;

  // Abrir en nueva pestaña o app
  window.open(enlace, "_blank");
});

});
