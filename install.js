const status = document.getElementById("status");
const btn = document.getElementById("btn");
let deferredPrompt;

navigator.serviceWorker.register("/sw.js");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  status.textContent = "Pronto para instalar.";
});

btn.onclick = async () => {
  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    status.textContent = "Notificações negadas.";
    return;
  }

  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    status.textContent =
      outcome === "accepted"
        ? "App instalado! Abra pelo ícone na tela."
        : "Instalação cancelada. Você ainda pode abrir /app.html";
  } else {
    status.textContent =
      "Use o menu do navegador → “Adicionar à tela inicial”, depois abra o app.";
  }

  location.href = "/app.html";
};
