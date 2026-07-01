/* ================================================
   LIGNE & OMBRE STUDIO — Portfolio JS
   ================================================ */

const STORAGE_KEY = 'los_portfolio';

const DEFAULT_PROJECTS = [
  {
    id: '1',
    title: 'Barrio Privado',
    location: 'Rancagua, Chile',
    year: '2018',
    description: 'Un conjunto residencial exclusivo en Rancagua, Chile, donde la arquitectura contemporánea se integra con el paisaje natural. Cada vivienda presenta líneas limpias, amplios ventanales y materiales nobles como piedra y madera, creando espacios luminosos y de alto confort. La ejecución impecable realza la privacidad y la conexión con el entorno.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Barrio privado en Rancagua, Chile/WhatsApp Image 2026-06-29 at 19.06.33.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Barrio privado en Rancagua, Chile/2.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Barrio privado en Rancagua, Chile/3.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Barrio privado en Rancagua, Chile/4.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Barrio privado en Rancagua, Chile/5.jpeg'
    ]
  },
  {
    id: '2',
    title: 'Shopping',
    location: 'Curicó, Chile',
    year: '2019',
    description: 'Un centro comercial vanguardista en Curicó, Chile, diseñado para ofrecer una experiencia de compra única. La fachada dinámica combina cristal, acero y volúmenes geométricos, mientras que el interior fluye en espacios abiertos y bien iluminados. Cada detalle constructivo refleja precisión y calidad, desde la estructura hasta los acabados.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Shopping en Curico, Chile/centro comercial chile.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Shopping en Curico, Chile/Centro comercial chile2.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Shopping en Curico, Chile/Centro comercial chile3.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Shopping en Curico, Chile/Centro comercial en chile.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Shopping en Curico, Chile/equipo de obras.jpeg'
    ]
  },
  {
    id: '3',
    title: 'Salón de eventos Aires del Arroyo',
    location: 'El Sombrero, Corrientes',
    year: '2023',
    description: 'Un espacio para eventos que destaca por su diseño escultórico y su integración con el paisaje. La cubierta singular, de hormigón visto, protege amplios espacios acristalados que difuminan los límites entre interior y exterior. Materiales como la madera y la piedra aportan calidez, mientras que la ejecución precisa garantiza durabilidad y sofisticación.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Nueva carpeta/sombrero.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Nueva carpeta/sombrero2.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Nueva carpeta/sombrero3.jpeg'
    ]
  },
  {
    id: '4',
    title: 'Proyecto Render',
    location: '',
    year: '2017',
    description: 'Visualizaciones arquitectónicas de alta fidelidad que exploran la plasticidad de la luz y el espacio. Cada render captura la esencia del diseño: atmósferas envolventes, texturas realistas y composiciones precisas que anticipan la experiencia espacial. Estas imágenes son herramientas clave para comunicar la visión del proyecto.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Renders/Principal.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Renders/6.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Renders/8.jpeg'
    ]
  },
  {
    id: '5',
    title: 'Obra Pluvial',
    location: 'Chillán, Chile',
    year: '2018',
    description: 'Infraestructura hidráulica de gran envergadura en Chillán, Chile, que demuestra la capacidad técnica del estudio. El proyecto optimiza el drenaje urbano mediante canales de hormigón armado y pendientes calculadas, reduciendo riesgos de inundación. La ejecución en obra combina maquinaria pesada con un control de calidad riguroso.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Pruvial en Chillan, Chile/tractor.jpeg',
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Pruvial en Chillan, Chile/alex tractor.jpeg'
    ]
  },
  {
    id: '6',
    title: 'Construcción en Seco',
    location: 'Chillán, Chile',
    year: '2018',
    description: 'Sistema constructivo eficiente basado en estructuras metálicas ligeras, aplicado en Chillán, Chile. La rapidez de montaje y la limpieza en obra son sus principales ventajas, sin sacrificar calidad ni resistencia. Esta solución sostenible reduce plazos y costes, ideal para proyectos que requieren flexibilidad y alto rendimiento.',
    images: [
      'Imagenes Pagina Arquitectura/Proyectos Arquitectura/Construcción en seco. Chillan, Chile/estructuras.jpeg'
    ]
  }
];

function getProjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Force migration if stored projects are in the old format or have different title mapping
      if (!Array.isArray(parsed) || parsed.length === 0 || !parsed[0].images || parsed[0].title !== 'Barrio Privado' || parsed[0].year !== '2018') {
        saveProjects(DEFAULT_PROJECTS);
        return DEFAULT_PROJECTS;
      }
      return parsed;
    } catch {
      return DEFAULT_PROJECTS;
    }
  }
  return DEFAULT_PROJECTS;
}

function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function renderPortfolio() {
  const container = document.getElementById('portfolio-grid');
  if (!container) return;
  const projects = getProjects();

  container.innerHTML = projects.length === 0
    ? '<p class="portfolio__empty">No hay proyectos.</p>'
    : projects.map(p => `
      <article class="portfolio-card reveal" onclick='openProjectModal(${JSON.stringify(p)})' data-hover>
        <div class="portfolio-card__img-wrap">
          ${p.images.map((img, idx) => `
            <img src="${img}" alt="${p.title}" class="portfolio-card__img ${idx === 0 ? 'active' : ''}" loading="lazy">
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

  // init hover rotation
  initHoverSlides();

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

function initHoverSlides() {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const images = card.querySelectorAll('.portfolio-card__img');
    if (images.length <= 1) return;

    let intervalId = null;
    let currentIndex = 0;

    const startSlideshow = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
      }, 1500);
    };

    const stopSlideshow = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      images.forEach((img, idx) => {
        if (idx === 0) {
          img.classList.add('active');
        } else {
          img.classList.remove('active');
        }
      });
      currentIndex = 0;
    };

    card.addEventListener('mouseenter', startSlideshow);
    card.addEventListener('mouseleave', stopSlideshow);
  });
}

window.openProjectModal = (p) => {
  openModal({ img: p.images[0], title: p.title, category: p.location || '', desc: p.description, year: p.year });
};

document.addEventListener('DOMContentLoaded', () => {
  renderPortfolio();
});
