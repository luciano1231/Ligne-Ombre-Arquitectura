/* ================================================
   LIGNE & OMBRE STUDIO — Portfolio JS
   ================================================ */

const STORAGE_KEY = 'los_portfolio';

const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Residencia Aldea',
    category: 'Residencial',
    year: '2023',
    description: 'Casa de 480m² con piscina desbordante integrada al paisaje. Diseño contemporáneo con materiales de primera calidad: vidrio estructural, hormigón visto y madera de roble. Iluminación escénica de noche.',
    image: 'Imagenes Pagina Arquitectura/ALDEA-REAL-6-1.jpg'
  },
  {
    id: '2',
    title: 'Atrio Lumínico',
    category: 'Interiorismo',
    year: '2023',
    description: 'Diseño de interior corporativo con atrio central de doble altura. Revestimiento en madera laminada natural, sistema de iluminación cenital y fachada de vidrio estructural que maximiza la luz natural.',
    image: 'Imagenes Pagina Arquitectura/cool-staircase-with-lights-modern-building.jpg'
  },
  {
    id: '3',
    title: 'Torre Meridian',
    category: 'Comercial',
    year: '2022',
    description: 'Edificio de oficinas corporativas de 15 plantas en pleno centro financiero. Fachada de doble piel de vidrio con control solar automatizado y certificación ambiental.',
    image: 'Imagenes Pagina Arquitectura/arquitectura-moderna-cdmx-header.jpg'
  },
  {
    id: '4',
    title: 'Fachada Urbana',
    category: 'Reforma',
    year: '2022',
    description: 'Reforma integral de fachada en edificio histórico del centro. Intervención que dialoga entre lo moderno y lo patrimonial, con nueva envolvente de hormigón y acero de alto contraste.',
    image: 'Imagenes Pagina Arquitectura/greyscale-low-angle-shot-building-with-cool-design.jpg'
  }
];

function getProjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return DEFAULT_PROJECTS; }
  }
  return DEFAULT_PROJECTS;
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderPortfolio(filter = 'todos') {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  const projects = getProjects();
  const filtered = filter === 'todos'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  container.innerHTML = filtered.length === 0
    ? '<p class="portfolio__empty">No hay proyectos en esta categoría.</p>'
    : filtered.map(p => `
      <article class="portfolio-card reveal" onclick='openProjectModal(${JSON.stringify(p)})' data-hover>
        <div class="portfolio-card__img-wrap">
          <img src="${p.image}" alt="${p.title}" class="portfolio-card__img" loading="lazy">
          <div class="portfolio-card__overlay">
            <span class="portfolio-card__view">Ver proyecto
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
        <div class="portfolio-card__body">
          <span class="portfolio-card__cat t-label">${p.category}</span>
          <h3 class="portfolio-card__title">${p.title}</h3>
          <span class="portfolio-card__year">${p.year || ''}</span>
        </div>
      </article>
    `).join('');

  // re-observe reveal
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 120;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

window.openProjectModal = (p) => {
  openModal({ img: p.image, title: p.title, category: p.category, desc: p.description, year: p.year });
};

// Filter tabs
document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();

  document.querySelectorAll('.portfolio-filter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.portfolio-filter__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.dataset.filter);
    });
  });
});
