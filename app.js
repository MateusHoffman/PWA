const status = document.getElementById("status");
const btn = document.getElementById("btn");

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}

if (!isStandalone) {
  status.textContent =
    "Abra este app pelo ícone da Tela de Início (não pelo Safari).";
}

btn.onclick = async () => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    status.textContent = "Este navegador não suporta notificações web.";
    return;
  }

  if (!isStandalone) {
    status.textContent =
      "No iPhone, notificações só funcionam depois de Adicionar à Tela de Início e abrir pelo ícone.";
    return;
  }

  const perm = await Notification.requestPermission();
  if (perm !== "granted") {
    status.textContent = "Permissão negada. Ative em Ajustes → Notificações.";
    return;
  }

  const reg = await navigator.serviceWorker.ready;
  status.textContent = "Ativas. Próxima em ~1 min.";

  const ping = () => {
    reg.showNotification("Teste PWA", {
      body: "Ping — " + new Date().toLocaleTimeString(),
      icon: "/icon-192.png",
    });
  };

  ping();
  setInterval(ping, 60_000);
  btn.disabled = true;
};
