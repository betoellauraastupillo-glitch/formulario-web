// ------------------------
// Generar resumen
// ------------------------
document.getElementById("formulario").addEventListener("submit", function (event) {
  event.preventDefault();

  let resumen = "📋 RESUMEN DE TRABAJO REALIZADO\n\n";

  // Campos existentes en tu formulario
  const camposEnOrden = [
    "fecha",
    "acompanante",
    "cliente",
    "trabajor",
    "nota"
  ];

  for (let campo of camposEnOrden) {
    const input = document.getElementById(campo);
    if (!input) continue; // Si el campo no existe, lo salta

    const label = document.querySelector(`label[for="${campo}"]`);
    const nombreCampo = label ? label.textContent.replace(":", "").trim() : campo;
    const valor = input.value.trim();

    if (campo === "trabajor") {
      resumen += `● ${nombreCampo}:\n${valor || "No especificado"}\n\n`;
    } else {
      resumen += `● ${nombreCampo}: ${valor || "No especificado"}\n`;
    }
  }

  // Mostrar resumen
  document.getElementById("resumen-texto").textContent = resumen;
  document.getElementById("formulario-seccion").style.display = "none";
  document.getElementById("resumen-seccion").style.display = "block";
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
