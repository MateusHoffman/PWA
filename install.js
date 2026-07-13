const status = document.getElementById("status");
const btn = document.getElementById("btn");
const iosSteps = document.getElementById("ios-steps");
let deferredPrompt;

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

if (isIOS) {
  iosSteps.hidden = false;
  btn.textContent = "Já adicionei — abrir app";
  status.textContent = isStandalone
    ? "App aberto pela tela inicial."
    : "Siga os passos e abra pelo ícone da tela inicial.";
}

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  btn.textContent = "Instalar app";
  status.textContent = "Pronto para instalar (Android/Chrome).";
});

btn.onclick = async () => {
  if (isIOS) {
    if (isStandalone) {
      location.href = "/app.html";
      return;
    }
    status.textContent =
      "No iPhone: Compartilhar → Adicionar à Tela de Início → abrir o ícone.";
    return;
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    status.textContent =
      outcome === "accepted"
        ? "Instalado! Abra pelo ícone."
        : "Cancelado. Você pode abrir o app mesmo assim.";
  } else {
    status.textContent = "Menu do navegador → Instalar app / Adicionar à tela.";
  }

  location.href = "/app.html";
};
