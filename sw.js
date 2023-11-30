// install event
self.addEventListener("install", (evt) => {
  console.log("service worker installed");
});

// activate event 1
self.addEventListener("activate", (evt) => {
  console.log("service worker activated");
});

// fetch event
self.addEventListener("fetch", (evt) => {
  console.log("fetch event", evt);
});
