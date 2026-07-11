/* ================================================
   LIGNE & OMBRE STUDIO — Catálogo de Muebles JS
   ================================================ */

const CAT_STORAGE_KEY = 'los_catalogo';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Base de sommier con cajonera',
    category: 'Camas',
    material: 'Madera y Melamina',
    description: 'Base de sommier optimizada con cajones inferiores para maximizar el guardado en tu dormitorio. Diseño robusto y funcional.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Base de sommier con cajonera/BAse de somier con cajonera.jpeg'
  },
  {
    id: '2',
    name: 'Juego de comedor',
    category: 'Comedor',
    material: 'Madera sólida',
    description: 'Juego de comedor con mesa y sillas de diseño moderno, perfecto para espacios acogedores y reuniones familiares.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Juego de comedor/juego de comedor.jpeg'
  },
  {
    id: '3',
    name: 'Mesa de escritorio de dormitorio',
    category: 'Escritorios',
    material: 'Madera y Melamina',
    description: 'Escritorio compacto y moderno, ideal para habitaciones o espacios de home office con un diseño limpio.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Mesa escritorio/Mesa de escritorio de dormitorio colores.jpeg'
  },
  {
    id: '4',
    name: 'Mesa ratona',
    category: 'Mesas',
    material: 'Madera',
    description: 'Mesa ratona de centro con un estilo contemporáneo, perfecta para complementar el living.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Mesa raton/mesa ratona.jpeg'
  },
  {
    id: '5',
    name: 'Mesa de luz moderna',
    category: 'Mesas',
    material: 'Madera',
    description: 'Mesa de luz flotante y de pie con cajones espaciosos y líneas minimalistas para tu dormitorio.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Mesas de luz/MEsa de luz 2.jpeg'
  },
  {
    id: '6',
    name: 'Muebles de cocina MDF',
    category: 'Cocina',
    material: 'MDF y Madera',
    description: 'Amoblamiento de cocina integral a medida, con bajo mesadas y alacenas en terminación moderna y de alta durabilidad.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Muebles de cocina/Muebles de cocina mdf.jpeg'
  },
  {
    id: '7',
    name: 'Juego de dormitorio',
    category: 'Camas',
    material: 'Madera y Melamina',
    description: 'Mobiliario integral para dormitorio incluyendo placard y cama, con detalles en texturas cálidas.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Muebles de dormitorio/muebles juedo de dormitorio.jpeg'
  },
  {
    id: '8',
    name: 'Mueble organizador',
    category: 'Otros',
    material: 'Madera',
    description: 'Mueble multiuso ideal para organización en áreas comunes o baños, fabricado con materiales resistentes a la humedad.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Otros/Mueble.jpeg'
  },
  {
    id: '9',
    name: 'Respaldo con mesas de luz',
    category: 'Camas',
    material: 'Melamina',
    description: 'Respaldo de cama integrado con mesas de luz flotantes, creando un diseño unificado y elegante para la habitación.',
    image: 'Imagenes Pagina Arquitectura/Espacios/Muebles/Respaldo de cama con mesas de luz/respaldo de cama con mesas de luz en melamina.jpeg'
  }
];

const CAT_KEYS_STORAGE = 'los_muebles_categorias';

const DEFAULT_CATEGORIES = [
  { id: 'cat_1', name: 'Camas' },
  { id: 'cat_2', name: 'Comedor' },
  { id: 'cat_3', name: 'Cocina' },
  { id: 'cat_4', name: 'Mesas' },
  { id: 'cat_5', name: 'Escritorios' },
  { id: 'cat_6', name: 'Otros' }
];

function getCategories() {
  const stored = localStorage.getItem(CAT_KEYS_STORAGE);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  saveCategories(DEFAULT_CATEGORIES);
  return DEFAULT_CATEGORIES;
}

function saveCategories(categories) {
  localStorage.setItem(CAT_KEYS_STORAGE, JSON.stringify(categories));
}

function getProducts() {
  const stored = localStorage.getItem(CAT_STORAGE_KEY);
  if (stored) {
    try { 
      const parsed = JSON.parse(stored); 
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {}
  }
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(products));
}

const DEFAULT_INT_PROJECTS = [
  {
    id: 'int_1',
    title: 'Diseño de interior Gimnasio',
    location: 'Corrientes Capital',
    year: '2026',
    description: 'Diseño integral de interior para gimnasio en Corrientes Capital. Espacios pensados para el dinamismo, el entrenamiento cómodo y una estética enérgica.',
    images: ['Imagenes Pagina Arquitectura/Espacios/Interiorismo/Diseño de interior Gimnasio, Corrientes capital 2026/gim1.jpeg']
  },
  {
    id: 'int_2',
    title: 'Oficina Corporativa Litoral',
    location: 'Resistencia, Chaco',
    year: '2025',
    description: 'Diseño de oficinas modernas enfocadas en la productividad, la comodidad del equipo y la identidad de marca de la empresa.',
    images: ['assets/img/oficina_interior.png']
  },
  {
    id: 'int_3',
    title: 'Café Boutique Corrientes',
    location: 'Corrientes Capital',
    year: '2025',
    description: 'Ambiente cálido y acogedor diseñado a medida para una cafetería boutique con detalles artesanales en madera sólida.',
    images: ['assets/img/cafe_interior.png']
  }
];

function getInterioresProjects() {
  const stored = localStorage.getItem('los_interiores_proyectos');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  saveInterioresProjects(DEFAULT_INT_PROJECTS);
  return DEFAULT_INT_PROJECTS;
}

function saveInterioresProjects(projects) {
  localStorage.setItem('los_interiores_proyectos', JSON.stringify(projects));
}

function buildWAMessage(product) {
  const msg = `Hola Carolina! Me interesa el mueble *${product.name}* (${product.material}). Me podrías dar más información y presupuesto? Gracias!`;
  return `https://wa.me/5491133306242?text=${encodeURIComponent(msg)}`;
}

function renderCatalog(filter = 'todos') {
  const container = document.getElementById('catalogo-grid');
  if (!container) return;
  const products = getProducts();
  const filtered = filter === 'todos'
    ? products
    : products.filter(p => p.category.toLowerCase() === filter.toLowerCase());

  container.innerHTML = filtered.length === 0
    ? '<p class="catalogo__empty">No hay productos en esta categoría.</p>'
    : filtered.map(p => `
      <article class="product-card reveal" data-hover>
        <div class="product-card__img-wrap" onclick='openProductModal(${JSON.stringify(p)})' style="cursor:pointer">
          <img src="${p.images ? p.images[0] : p.image}" alt="${p.name}" class="product-card__img" loading="lazy">
          <span class="product-card__cat t-label">${p.category}</span>
        </div>
        <div class="product-card__body">
          <h3 class="product-card__name">${p.name}</h3>
          <p class="product-card__material">${p.material}</p>
          <p class="product-card__desc">${p.description}</p>
          <a href="${buildWAMessage(p)}" target="_blank" class="btn btn--primary product-card__cta">
            Cotizar por WhatsApp
            <svg viewBox="0 0 24 24" fill="currentColor" width="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
        </div>
      </article>
    `).join('');

  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 100;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

window.openProductModal = (p) => {
  openModal({ 
    images: p.images || [p.image], 
    title: p.name, 
    category: p.category, 
    desc: p.description 
  });
};

if (!window.openProjectModal) {
  window.openProjectModal = (p) => {
    openModal({ 
      images: p.images || [p.image], 
      title: p.title, 
      category: p.location || '', 
      desc: p.description || '', 
      year: p.year || '' 
    });
  };
}

function renderInterioresProjects() {
  const container = document.getElementById('interiores-projects-grid');
  if (!container) return;
  const projects = getInterioresProjects();

  container.innerHTML = projects.length === 0
    ? '<p class="portfolio__empty">No hay proyectos de interiorismo.</p>'
    : projects.map(p => `
      <article class="portfolio-card reveal" onclick='openProjectModal(${JSON.stringify(p)})' style="cursor:pointer">
        <div class="portfolio-card__img-wrap" style="padding-top: 60%; position: relative; overflow: hidden;">
          ${(p.images || [p.image]).map((img, idx) => `
            <img src="${img}" alt="${p.title}" class="portfolio-card__img ${idx === 0 ? 'active' : ''}" loading="lazy" style="object-fit: cover; position: absolute; top:0; left:0; width:100%; height:100%;">
          `).join('')}
          <div class="portfolio-card__overlay">
            <span class="portfolio-card__view">Ver proyecto
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </span>
          </div>
        </div>
        <div class="portfolio-card__body">
          <h3 class="portfolio-card__title">${p.title}</h3>
          <div class="portfolio-card__meta">
            ${p.location ? `<span class="portfolio-card__location">${p.location}</span>` : ''}
            ${p.location && p.year ? '<span class="portfolio-card__separator">·</span>' : ''}
            <span class="portfolio-card__year">${p.year || ''}</span>
          </div>
        </div>
      </article>
    `).join('');

  // re-observe reveal
  container.querySelectorAll('.reveal').forEach((el, i) => {
    el.dataset.delay = i * 100;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

function renderCategoryFilters() {
  const container = document.getElementById('catalogo-filter-container');
  if (!container) return;
  
  const categories = getCategories();
  
  container.innerHTML = `
    <button class="catalogo-filter__btn active" data-filter="todos">Todos</button>
    ${categories.map(c => `
      <button class="catalogo-filter__btn" data-filter="${c.name}">${c.name}</button>
    `).join('')}
  `;
  
  container.querySelectorAll('.catalogo-filter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.catalogo-filter__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog(btn.dataset.filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryFilters();
  renderCatalog();
  renderInterioresProjects();
});
