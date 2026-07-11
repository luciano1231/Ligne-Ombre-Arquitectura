/* ================================================
   LIGNE & OMBRE STUDIO — Admin Centralizado JS
   ================================================ */

const PASS = 'studio2024';

// Claves de LocalStorage
const KEYS = {
  arquitectura: 'los_portfolio',
  interiores: 'los_interiores_proyectos',
  catalogo: 'los_catalogo'
};

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

// Estado del administrador
let currentTab = 'arquitectura';
let uploadedImages = []; // Array de Base64 de las imágenes cargadas o URLs

// Al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('los_admin_logged') === 'true') {
    showAdminPanel();
  } else {
    showLoginScreen();
  }
});

// Autenticación
function doLogin() {
  const val = document.getElementById('pwInput').value;
  if (val === PASS) {
    sessionStorage.setItem('los_admin_logged', 'true');
    showAdminPanel();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function doLogout() {
  sessionStorage.removeItem('los_admin_logged');
  showLoginScreen();
}

function showLoginScreen() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  document.getElementById('pwInput').value = '';
}

function showAdminPanel() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  switchTab(currentTab);
}

// Control de Pestañas (Tab selector)
function switchTab(tab) {
  currentTab = tab;
  
  // Actualizar botones activos
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(`tab-${tab}`).classList.add('active');
  
  // Cambiar etiquetas y visibilidad de campos según el tipo
  const fieldLocation = document.getElementById('field-location');
  const fieldCategory = document.getElementById('field-category');
  const fieldYear = document.getElementById('field-year');
  const fieldMaterial = document.getElementById('field-material');
  const categoriesSection = document.getElementById('categoriesSection');
  
  const lblTitle = document.getElementById('lblTitle');
  const lblImages = document.getElementById('lblImages');
  
  const formTitle = document.getElementById('formTitle');
  const listTitle = document.getElementById('listTitle');
  
  resetForm();
  
  if (tab === 'arquitectura' || tab === 'interiores') {
    fieldLocation.style.display = 'block';
    fieldYear.style.display = 'block';
    fieldCategory.style.display = 'none';
    fieldMaterial.style.display = 'none';
    if (categoriesSection) categoriesSection.style.display = 'none';
    
    lblTitle.textContent = 'Título del proyecto *';
    lblImages.textContent = 'Imágenes (Subir una o varias) *';
    formTitle.textContent = tab === 'arquitectura' ? 'Agregar Proyecto de Arquitectura' : 'Agregar Proyecto de Interiores';
    listTitle.textContent = tab === 'arquitectura' ? 'Proyectos de Arquitectura Cargados' : 'Proyectos de Interiores Cargados';
  } else if (tab === 'catalogo') {
    fieldLocation.style.display = 'none';
    fieldYear.style.display = 'none';
    fieldCategory.style.display = 'block';
    fieldMaterial.style.display = 'block';
    if (categoriesSection) categoriesSection.style.display = 'block';
    
    lblTitle.textContent = 'Nombre del mueble *';
    lblImages.textContent = 'Imagen del mueble (Subir o pegar URL) *';
    formTitle.textContent = 'Agregar Mueble al Catálogo';
    listTitle.textContent = 'Muebles en el Catálogo';
    
    populateCategorySelect();
    renderCategoryList();
  }
  
  renderList();
}

// Carga y guardado genérico en LocalStorage
function getItems(tab) {
  const key = KEYS[tab];
  const s = localStorage.getItem(key);
  if (s) {
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }
  return [];
}

function saveItems(tab, items) {
  const key = KEYS[tab];
  localStorage.setItem(key, JSON.stringify(items));
}

// Renderizado de listados
function renderList() {
  const items = getItems(currentTab);
  const container = document.getElementById('itemList');
  document.getElementById('countBadge').textContent = items.length;
  
  if (items.length === 0) {
    container.innerHTML = `<p class="admin-list-empty">No hay elementos cargados en esta sección. ¡Crea uno nuevo!</p>`;
    return;
  }
  
  container.innerHTML = items.map(item => {
    let title = '';
    let meta = '';
    let imgSrc = 'assets/logo.svg';
    
    if (currentTab === 'arquitectura' || currentTab === 'interiores') {
      title = item.title;
      meta = `${item.location || 'Sin ubicación'} · ${item.year || 's/f'}`;
      if (item.images && item.images.length > 0) {
        imgSrc = item.images[0];
      } else if (item.image) {
        imgSrc = item.image;
      }
    } else if (currentTab === 'catalogo') {
      title = item.name;
      meta = `${item.category} · ${item.material || 'Sin material'}`;
      if (item.images && item.images.length > 0) {
        imgSrc = item.images[0];
      } else if (item.image) {
        imgSrc = item.image;
      }
    }
    
    return `
      <div class="admin-list-item">
        <img src="${imgSrc}" alt="${title}" class="admin-list-img" onerror="this.src='assets/logo.svg'">
        <div class="admin-list-info">
          <div class="admin-list-name">${title}</div>
          <div class="admin-list-meta">${meta}</div>
        </div>
        <div class="admin-list-actions">
          <button class="admin-btn-edit" onclick="editItem('${item.id}')">Editar</button>
          <button class="admin-btn-del" onclick="deleteItem('${item.id}')">Eliminar</button>
        </div>
      </div>
    `;
  }).join('');
}

// Subida de imágenes a Base64
function handleImageUpload(input) {
  const files = input.files;
  if (!files || files.length === 0) return;
  
  let loadedCount = 0;
  
  Array.from(files).forEach(file => {
    const reader = new FileReader();
    reader.onload = e => {
      uploadedImages.push(e.target.result);
      loadedCount++;
      if (loadedCount === files.length) {
        renderPreview();
      }
    };
    reader.readAsDataURL(file);
  });
}

function removePreviewImage(idx) {
  uploadedImages.splice(idx, 1);
  renderPreview();
}

function renderPreview() {
  const container = document.getElementById('pPreviewContainer');
  const grid = document.getElementById('pPreviewGrid');
  
  if (uploadedImages.length === 0) {
    container.style.display = 'none';
    grid.innerHTML = '';
    return;
  }
  
  container.style.display = 'block';
  grid.innerHTML = uploadedImages.map((img, idx) => `
    <div class="preview-img-wrap">
      <img src="${img}" alt="Preview ${idx}">
      <button class="btn-remove-img" onclick="removePreviewImage(${idx})">✕</button>
    </div>
  `).join('');
}

// Guardado del formulario
function saveCurrentItem() {
  const editId = document.getElementById('editId').value;
  const title = document.getElementById('pTitle').value.trim();
  const desc = document.getElementById('pDesc').value.trim();
  const urlsText = document.getElementById('pImgUrls').value.trim();
  
  if (!title) {
    return showMsg('formMsg', 'El título/nombre es obligatorio.', 'err');
  }
  
  // Procesar URLs si las hay
  if (urlsText) {
    const urls = urlsText.split(',').map(url => url.trim()).filter(url => url !== '');
    uploadedImages = uploadedImages.concat(urls);
  }
  
  if (uploadedImages.length === 0) {
    // Intentar buscar imagen de repuesto o error si es obligatorio
    return showMsg('formMsg', 'Debes subir al menos una imagen o pegar una URL.', 'err');
  }
  
  let items = getItems(currentTab);
  let finalItem = {};
  
  if (currentTab === 'arquitectura' || currentTab === 'interiores') {
    const location = document.getElementById('pLocation').value.trim();
    const year = document.getElementById('pYear').value.trim();
    
    finalItem = {
      id: editId || Date.now().toString(),
      title,
      location,
      year,
      description: desc,
      images: uploadedImages,
      // Respaldar propiedad individual por compatibilidad vieja
      image: uploadedImages[0]
    };
  } else if (currentTab === 'catalogo') {
    const category = document.getElementById('pCat').value;
    const material = document.getElementById('pMaterial').value.trim();
    
    finalItem = {
      id: editId || Date.now().toString(),
      name: title,
      category,
      material,
      description: desc,
      images: uploadedImages,
      image: uploadedImages[0]
    };
  }
  
  if (editId) {
    items = items.map(item => item.id === editId ? finalItem : item);
    showMsg('formMsg', '✓ Elemento actualizado con éxito.', 'ok');
  } else {
    items.push(finalItem);
    showMsg('formMsg', '✓ Elemento guardado con éxito.', 'ok');
  }
  
  saveItems(currentTab, items);
  resetForm();
  renderList();
}

// Edición de un elemento
function editItem(id) {
  const items = getItems(currentTab);
  const item = items.find(x => x.id === id);
  if (!item) return;
  
  resetForm();
  
  document.getElementById('editId').value = item.id;
  document.getElementById('pDesc').value = item.description || '';
  
  // Rellenar según la pestaña activa
  if (currentTab === 'arquitectura' || currentTab === 'interiores') {
    document.getElementById('pTitle').value = item.title;
    document.getElementById('pLocation').value = item.location || '';
    document.getElementById('pYear').value = item.year || '';
    
    uploadedImages = item.images ? [...item.images] : (item.image ? [item.image] : []);
  } else if (currentTab === 'catalogo') {
    document.getElementById('pTitle').value = item.name;
    document.getElementById('pCat').value = item.category;
    document.getElementById('pMaterial').value = item.material || '';
    
    uploadedImages = item.images ? [...item.images] : (item.image ? [item.image] : []);
  }
  
  document.getElementById('formTitle').textContent = `Editar: ${document.getElementById('pTitle').value}`;
  document.getElementById('cancelBtn').style.display = 'inline-flex';
  
  renderPreview();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Eliminación de un elemento
function deleteItem(id) {
  if (!confirm('¿Estás seguro de que deseas eliminar este elemento?')) return;
  
  let items = getItems(currentTab);
  items = items.filter(x => x.id !== id);
  
  saveItems(currentTab, items);
  renderList();
}

// Resetear el formulario
function resetForm() {
  document.getElementById('editId').value = '';
  document.getElementById('pTitle').value = '';
  document.getElementById('pDesc').value = '';
  document.getElementById('pImgFiles').value = '';
  document.getElementById('pImgUrls').value = '';
  
  const fieldLocation = document.getElementById('pLocation');
  const fieldYear = document.getElementById('pYear');
  const fieldMaterial = document.getElementById('pMaterial');
  
  if (fieldLocation) fieldLocation.value = '';
  if (fieldYear) fieldYear.value = '';
  if (fieldMaterial) fieldMaterial.value = '';
  
  const selectCat = document.getElementById('pCat');
  if (selectCat && selectCat.options.length > 0) {
    selectCat.selectedIndex = 0;
  }
  
  uploadedImages = [];
  renderPreview();
  
  // Restablecer títulos por defecto
  const formTitle = document.getElementById('formTitle');
  if (currentTab === 'arquitectura') {
    formTitle.textContent = 'Agregar Proyecto de Arquitectura';
  } else if (currentTab === 'interiores') {
    formTitle.textContent = 'Agregar Proyecto de Interiores';
  } else if (currentTab === 'catalogo') {
    formTitle.textContent = 'Agregar Mueble al Catálogo';
  }
  
  document.getElementById('cancelBtn').style.display = 'none';
}

// Mensaje de feedback en el formulario
function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'admin-msg ' + type;
  el.style.display = 'block';
  setTimeout(() => {
    el.style.display = 'none';
  }, 4000);
}

// ================================================
// LÓGICA DE CATEGORÍAS
// ================================================

function populateCategorySelect() {
  const select = document.getElementById('pCat');
  if (!select) return;
  const categories = getCategories();
  
  // Guardar el valor seleccionado actual
  const val = select.value;
  
  select.innerHTML = categories.map(c => `
    <option value="${c.name}">${c.name}</option>
  `).join('');
  
  // Intentar restaurar el valor seleccionado
  if (val && categories.some(c => c.name === val)) {
    select.value = val;
  }
}

function renderCategoryList() {
  const container = document.getElementById('categoryList');
  if (!container) return;
  const categories = getCategories();
  
  container.innerHTML = categories.map(c => `
    <div class="admin-list-item" style="padding: 10px 16px;">
      <div class="admin-list-info">
        <div class="admin-list-name" style="font-size: 0.95rem;">${c.name}</div>
      </div>
      <div class="admin-list-actions">
        <button class="admin-btn-edit" onclick="editCategory('${c.id}')" style="padding: 6px 12px; font-size: 0.68rem;">Editar</button>
        <button class="admin-btn-del" onclick="deleteCategory('${c.id}')" style="padding: 6px 12px; font-size: 0.68rem;">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function saveCategory() {
  const editId = document.getElementById('editCatId').value;
  const nameInput = document.getElementById('catInput');
  const name = nameInput.value.trim();
  
  if (!name) {
    return showMsg('catMsg', 'El nombre de la categoría es obligatorio.', 'err');
  }
  
  let categories = getCategories();
  const exists = categories.some(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== editId);
  if (exists) {
    return showMsg('catMsg', 'Esta categoría ya existe.', 'err');
  }
  
  if (editId) {
    const oldCat = categories.find(c => c.id === editId);
    const oldName = oldCat ? oldCat.name : null;
    
    categories = categories.map(c => c.id === editId ? { id: editId, name } : c);
    
    if (oldName && oldName !== name) {
      let muebles = getItems('catalogo');
      let modificado = false;
      muebles = muebles.map(m => {
        if (m.category === oldName) {
          m.category = name;
          modificado = true;
        }
        return m;
      });
      if (modificado) saveItems('catalogo', muebles);
    }
    showMsg('catMsg', '✓ Categoría actualizada con éxito.', 'ok');
  } else {
    categories.push({ id: 'cat_' + Date.now().toString(), name });
    showMsg('catMsg', '✓ Categoría creada con éxito.', 'ok');
  }
  
  saveCategories(categories);
  resetCatForm();
  renderCategoryList();
  populateCategorySelect();
}

function editCategory(id) {
  const categories = getCategories();
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  
  document.getElementById('editCatId').value = cat.id;
  document.getElementById('catInput').value = cat.name;
  document.getElementById('btnSaveCat').textContent = 'Actualizar';
  document.getElementById('cancelCatBtn').style.display = 'inline-flex';
}

function deleteCategory(id) {
  let categories = getCategories();
  const catToDelete = categories.find(c => c.id === id);
  if (!catToDelete) return;
  
  if (!confirm(`¿Estás seguro de eliminar la categoría "${catToDelete.name}"? Los muebles de esta categoría se reasignarán a "Otros".`)) {
    return;
  }
  
  categories = categories.filter(c => c.id !== id);
  
  if (categories.length === 0) {
    categories.push({ id: 'cat_6', name: 'Otros' });
  }
  
  saveCategories(categories);
  
  const defaultCatName = categories.some(c => c.name === 'Otros') ? 'Otros' : categories[0].name;
  
  let muebles = getItems('catalogo');
  let modificado = false;
  muebles = muebles.map(m => {
    if (m.category === catToDelete.name) {
      m.category = defaultCatName;
      modificado = true;
    }
    return m;
  });
  if (modificado) {
    saveItems('catalogo', muebles);
    renderList();
  }
  
  resetCatForm();
  renderCategoryList();
  populateCategorySelect();
}

function resetCatForm() {
  document.getElementById('editCatId').value = '';
  document.getElementById('catInput').value = '';
  document.getElementById('btnSaveCat').textContent = 'Guardar';
  document.getElementById('cancelCatBtn').style.display = 'none';
}
