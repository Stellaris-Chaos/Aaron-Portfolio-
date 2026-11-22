/* =========================================================
   main.js — builds the pages from the PROJECTS list in projects.js
   You normally don't need to edit this file.
   ========================================================= */

document.getElementById("year").textContent = new Date().getFullYear();

const page = document.body.dataset.page;
if (page === "home") renderHome();
if (page === "project") renderProject();

/* ---------- Home page: project cards ---------- */
function renderHome() {
  const grid = document.getElementById("project-grid");
  grid.innerHTML = PROJECTS.map(p => `
      <a class="card" href="project.html?id=${encodeURIComponent(p.id)}">
        <div class="card-thumb">
          <img src="${p.cover || p.images[0]}" alt="${p.title}" loading="lazy">
        </div>
        <div class="card-body">
          <h3>${p.title}</h3>
        </div>
      </a>`).join("");
}

/* ---------- Project page ---------- */
function renderProject() {
  const root = document.getElementById("project");
  const id = new URLSearchParams(location.search).get("id");
  const index = PROJECTS.findIndex(p => p.id === id);

  if (index === -1) {
    root.innerHTML = `
      <div class="not-found">
        <h1>Project not found</h1>
        <p>This project doesn't exist or may have been moved.</p>
        <a href="index.html#work" class="btn">Back to all work</a>
      </div>`;
    return;
  }

  const p = PROJECTS[index];
  document.title = `${p.title} — Aaron`;

  const hero = p.cover || p.images[0];
  // Every image the lightbox can show: cover first, then gallery (no duplicates)
  const allImages = [hero, ...p.images.filter(src => src !== hero)];

  root.innerHTML = `
    <a href="index.html#work" class="back-link">&larr; Back to all work</a>

    <div class="project-info">
      <h1>${p.title}</h1>
      ${p.description ? `<p class="desc">${p.description}</p>` : ""}
    </div>


    ${p.sketchfab ? `
      <div class="embed">
        <iframe src="https://sketchfab.com/models/${p.sketchfab}/embed" title="${p.title} 3D viewer"
          allow="autoplay; fullscreen; xr-spatial-tracking" allowfullscreen></iframe>
      </div>` : ""}

    <div class="gallery">
      ${allImages.map((src, i) => `
        <button data-index="${i}" aria-label="Open image ${i + 1}">
          <img src="${src}" alt="${p.title} — image ${i + 1}"${i > 1 ? ' loading="lazy"' : ""}>
        </button>`).join("")}
    </div>
  `;

  setupLightbox(allImages, root);
}

/* ---------- Lightbox: click an image to view it full screen ---------- */
function setupLightbox(images, root) {
  const box = document.getElementById("lightbox");
  const img = box.querySelector(".lb-img");
  const count = box.querySelector(".lb-count");
  let current = 0;

  const show = i => {
    current = (i + images.length) % images.length;
    img.src = images[current];
    count.textContent = `${current + 1} / ${images.length}`;
  };
  const open = i => { show(i); box.hidden = false; document.body.style.overflow = "hidden"; };
  const close = () => { box.hidden = true; document.body.style.overflow = ""; };

  root.addEventListener("click", e => {
    const target = e.target.closest("[data-index]");
    if (target) open(Number(target.dataset.index));
  });

  box.querySelector(".lb-close").onclick = close;
  box.querySelector(".lb-prev").onclick = () => show(current - 1);
  box.querySelector(".lb-next").onclick = () => show(current + 1);
  box.addEventListener("click", e => { if (e.target === box) close(); });

  document.addEventListener("keydown", e => {
    if (box.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  const single = images.length < 2;
  box.querySelector(".lb-prev").hidden = single;
  box.querySelector(".lb-next").hidden = single;
}
