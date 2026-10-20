/* First 5K service worker — cache-first offline support */
const CACHE = "first5k-v25";

const ASSETS = [
  "./",
  "index.html",
  "manifest.json",
  "player.js",
  "player.css",
  "music/playlist.json",
  "icon-192.png",
  "icon-512.png",
  "icon-maskable-512.png",
  "cue3-start.mp3",
  "cue3-walk.mp3",
  "cue3-resumed.mp3",
  "cue3-complete.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        ASSETS.map((url) => cache.add(url).catch(() => {}))
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE && key.startsWith("first5k-"))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* Music MP3s: cache-first, cached on first play. Range requests are served
   as 206 slices of the full file so seeking and iOS Safari work offline.
   A 206 response is never put into the cache. */
async function serveMusic(request) {
  const cache = await caches.open(CACHE);
  const key = request.url;
  let full = await cache.match(key, { ignoreSearch: true });
  const range = request.headers.get("Range");

  if (!range) {
    if (full) return full;
    const res = await fetch(request);
    if (res.ok) {
      try { await cache.put(key, res.clone()); } catch (e) {}
    }
    return res;
  }

  if (!full) {
    // Fetch the complete file (a plain GET carries no Range header), cache
    // the 200, then slice the requested range out of it.
    const res = await fetch(key);
    if (!res.ok) return res;
    try { await cache.put(key, res.clone()); } catch (e) {}
    full = res;
  }

  const blob = await full.blob();
  const size = blob.size;
  const m = /bytes=(\d*)-(\d*)/.exec(range);
  if (!m) {
    return new Response(blob, {
      headers: { "Content-Type": "audio/mpeg", "Accept-Ranges": "bytes" }
    });
  }
  let start, end;
  if (m[1] === "" && m[2] !== "") {
    // Suffix range: the last N bytes.
    start = Math.max(0, size - parseInt(m[2], 10));
    end = size - 1;
  } else {
    start = m[1] === "" ? 0 : parseInt(m[1], 10);
    end = m[2] === "" ? size - 1 : Math.min(parseInt(m[2], 10), size - 1);
  }
  if (start >= size || start > end) {
    return new Response(null, {
      status: 416,
      headers: { "Content-Range": "bytes */" + size }
    });
  }
  const slice = blob.slice(start, end + 1);
  return new Response(slice, {
    status: 206,
    statusText: "Partial Content",
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Length": String(slice.size),
      "Content-Range": "bytes " + start + "-" + end + "/" + size,
      "Accept-Ranges": "bytes"
    }
  });
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.pathname.includes("/music/") && url.pathname.endsWith(".mp3")) {
    event.respondWith(serveMusic(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((cached) => cached || fetch(event.request))
  );
});

/* pages build refresh 2026-10-20 */
