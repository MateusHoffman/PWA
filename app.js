const status = document.getElementById("status");

navigator.serviceWorker.register("/sw.js").then(async (reg) => {
  let perm = Notification.permission;
  if (perm !== "granted") {
    perm = await Notification.requestPermission();
  }

  if (perm !== "granted") {
    status.textContent = "Notificações bloqueadas.";
    return;
  }

  status.textContent = "Notificações ativas. Próxima em ~1 min.";

  const ping = () => {
    reg.showNotification("Teste PWA", {
      body: "Ping a cada 1 minuto — " + new Date().toLocaleTimeString(),
      icon: "/icon-192.png",
      badge: "/icon-192.png",
    });
  };

  // primeira notificação já, depois a cada 60s
  ping();
  setInterval(ping, 60_000);
});
