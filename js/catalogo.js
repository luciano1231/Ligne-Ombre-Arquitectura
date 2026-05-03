/* ================================================
   LIGNE & OMBRE STUDIO — Catálogo de Muebles JS
   ================================================ */

const CAT_STORAGE_KEY = 'los_catalogo';

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    name: 'Mesa Río Grande',
    category: 'Mesas',
    material: 'Madera sólida de roble',
    description: 'Mesa de comedor de diseño artesanal en roble macizo. Terminación con aceite natural de tung. Disponible en distintas medidas según requerimiento. Fabricación a medida.',
    image: 'assets/img/mueble-mesa.png'
  },
  {
    id: '2',
    name: 'Silla Carandaí',
    category: 'Sillas',
    material: 'Madera sólida de lenga',
    description: 'Silla de diseño minimalista en madera de lenga patagónica. Ergonomía estudiada, encastres a cola de milano. Tapizado en lino natural 100% disponible en múltiples colores.',
    image: 'assets/img/mueble-silla.png'
  },
  {
    id: '3',
    name: 'Estantería Ibera',
    category: 'Estanterías',
    material: 'Madera sólida de nogal',
    description: 'Sistema modular de estanterías en nogal negro. Montaje flotante, fijación oculta. Diseño que combina funcionalidad y estética. Disponible en múltiples configuraciones.',
    image: 'assets/img/mueble-estanteria.png'
  },
  {
    id: '4',
    name: 'Sofá Paraíso',
    category: 'Sillones',
    material: 'Estructura de roble y tapizado en lino',
    description: 'Sofá de diseño contemporáneo con estructura en roble macizo. Tapizado artesanal en lino natural 100% disponible en múltiples colores.',
    image: 'assets/img/mueble-sofa.png'
  },
  {
    id: '5',
    name: 'Escritorio Litoral',
    category: 'Escritorios',
    material: 'Madera sólida de nogal',
    description: 'Escritorio de diseño minimalista en nogal macizo. Patas de horquilla en acero, superficie amplia con acabado al aceite natural. Ideal para home office y estudios.',
    image: 'assets/img/mueble-escritorio.png'
  },
  {
    id: '6',
    name: 'Aparador Corrientes',
    category: 'Otros',
    material: 'Madera sólida de roble con detalles en latón',
    description: 'Aparador de diseño contemporáneo en roble macizo. Detalles en latón, puertas corredizas con guilloqué. Pieza central que aporta calidez y elegancia a cualquier comedor.',
    image: 'assets/img/mueble-aparador.png'
  }
];

function getProducts() {
  const stored = localStorage.getItem(CAT_STORAGE_KEY);
  if (stored) {
    try { return JSON.parse(stored); } catch { return DEFAULT_PRODUCTS; }
  }
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(products));
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
        <div class="product-card__img-wrap">
          <img src="${p.image}" alt="${p.name}" class="product-card__img" loading="lazy">
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

document.addEventListener('DOMContentLoaded', () => {
  renderCatalog();

  document.querySelectorAll('.catalogo-filter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.catalogo-filter__btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCatalog(btn.dataset.filter);
    });
  });
});
