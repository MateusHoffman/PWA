const status = document.getElementById("status");
const btn = document.getElementById("btn");
const countEl = document.getElementById("count");

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||
  navigator.standalone === true;

let left = 60;
let tick = null;
let reg = null;

function render() {
  countEl.hidden = false;
  countEl.textContent = "Próxima em " + left + "s";
}

async function notify() {
  const body = "Ping — " + new Date().toLocaleTimeString("pt-BR");
  try {
    await reg.showNotification("Teste PWA", {
      body,
      icon: "/icon-192.png",
      tag: "pwa-ping",
      renotify: true,
    });
  } catch {
    new Notification("Teste PWA", { body, icon: "/icon-192.png", tag: "pwa-ping" });
  }
  status.textContent = "Última notificação: " + new Date().toLocaleTimeString("pt-BR");
}

async function start() {
  if (!("Notification" in window)) {
    status.textContent = "Sem suporte a notificações.";
    return;
  }

  if (!isStandalone) {
    status.textContent = "Abra pelo ícone da Tela de Início.";
    return;
  }

  let perm = Notification.permission;
  if (perm !== "granted") perm = await Notification.requestPermission();
  if (perm !== "granted") {
    status.textContent = "Permissão negada.";
    return;
  }

  reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  if (tick) clearInterval(tick);
  left = 60;
  render();
  await notify();

  tick = setInterval(async () => {
    left -= 1;
    if (left <= 0) {
      left = 60;
      await notify();
    }
    render();
  }, 1000);

  btn.textContent = "Ativo";
  btn.disabled = true;
}

btn.onclick = start;

if (!isStandalone) {
  status.textContent = "Abra pelo ícone da Tela de Início.";
} else if (Notification.permission === "granted") {
  start();
}
