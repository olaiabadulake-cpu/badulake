// Service worker mínimo de Badulake (Tarea 16, D-030).
// Solo guarda la página «sin conexión» y su icono. NO guarda páginas, datos de nadie ni respuestas
// de la API: cada visita va siempre a la red. Si no hay red al abrir una página, se enseña la
// página «sin conexión». Para cambiarla, sube VERSION.
const VERSION = "badulake-sin-conexion-v1";
const FICHEROS = ["/sin-conexion.html", "/iconos/icono-192.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FICHEROS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((claves) => Promise.all(claves.filter((c) => c !== VERSION).map((c) => caches.delete(c))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  // Solo se interviene cuando una página (navegación) falla por falta de red. Todo lo demás pasa tal cual.
  if (request.mode !== "navigate") return;
  event.respondWith(
    fetch(request).catch(() => caches.match("/sin-conexion.html").then((r) => r ?? Response.error())),
  );
});
