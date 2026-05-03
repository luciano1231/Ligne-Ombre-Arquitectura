/* ================================================
   LIGNE & OMBRE STUDIO — Admin Muebles JS
   ================================================ */

const PASS     = 'studio2024';
const STOR_KEY = 'los_catalogo';

const DEFAULT_PRODUCTS = [
  { id:'1', name:'Mesa Río Grande', category:'Mesas', material:'Madera sólida de roble', description:'Mesa de comedor de diseño artesanal en roble macizo. Terminación con aceite natural de tung.', image:'assets/img/mueble-mesa.png' },
  { id:'2', name:'Silla Carandaí', category:'Sillas', material:'Madera sólida de lenga', description:'Silla de diseño minimalista en madera de lenga patagónica. Ergonomía estudiada, encastres a cola de milano.', image:'assets/img/mueble-silla.png' },
  { id:'3', name:'Estantería Ibera', category:'Estanterías', material:'Madera sólida de nogal', description:'Sistema modular de estanterías en nogal negro. Montaje flotante, fijación oculta.', image:'assets/img/mueble-estanteria.png' },
  { id:'4', name:'Sofá Paraíso', category:'Sillones', material:'Estructura de roble y tapizado en lino', description:'Sofá de diseño contemporáneo con estructura en roble macizo. Tapizado artesanal en lino natural.', image:'assets/img/mueble-sofa.png' }
];

function getProducts() {
  const s = localStorage.getItem(STOR_KEY);
  if (s) { try { return JSON.parse(s); } catch {} }
  return DEFAULT_PRODUCTS;
}
function saveProducts(p) { localStorage.setItem(STOR_KEY, JSON.stringify(p)); }

let currentImgData = null;

function doLogin() {
  const val = document.getElementById('pwInput').value;
  if (val === PASS) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display  = 'block';
    renderList();
  } else {
    document.getElementById('loginError').style.display = 'block';
  }
}

function doLogout() {
  document.getElementById('adminPanel').style.display  = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('pwInput').value = '';
}

function previewImage(input, previewId) {
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentImgData = e.target.result;
    const preview = document.getElementById(previewId);
    preview.style.display = 'block';
    document.getElementById(previewId + 'Img').src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}
window.previewImage = previewImage;

function saveMueble() {
  const id       = document.getElementById('editId').value;
  const name     = document.getElementById('mName').value.trim();
  const cat      = document.getElementById('mCat').value;
  const material = document.getElementById('mMaterial').value.trim();
  const desc     = document.getElementById('mDesc').value.trim();
  const url      = document.getElementById('mImgUrl').value.trim();

  if (!name) return showMsg('formMsg', 'El nombre es obligatorio.', 'err');

  const image = currentImgData || url || 'assets/img/mueble-mesa.png';

  let products = getProducts();
  if (id) {
    products = products.map(p => p.id === id ? { id, name, category: cat, material, description: desc, image } : p);
    showMsg('formMsg', '✓ Mueble actualizado correctamente.', 'ok');
  } else {
    products.push({ id: Date.now().toString(), name, category: cat, material, description: desc, image });
    showMsg('formMsg', '✓ Mueble agregado al catálogo.', 'ok');
  }
  saveProducts(products);
  resetForm();
  renderList();
}
window.saveMueble = saveMueble;

function editMueble(id) {
  const p = getProducts().find(x => x.id === id);
  if (!p) return;
  document.getElementById('editId').value    = p.id;
  document.getElementById('mName').value     = p.name;
  document.getElementById('mCat').value      = p.category;
  document.getElementById('mMaterial').value = p.material || '';
  document.getElementById('mDesc').value     = p.description;
  document.getElementById('mImgUrl').value   = p.image;
  document.getElementById('formTitle').textContent = 'Editar Mueble';
  document.getElementById('cancelBtn').style.display = 'inline-flex';
  currentImgData = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.editMueble = editMueble;

function deleteMueble(id) {
  if (!confirm('¿Eliminar este mueble del catálogo?')) return;
  saveProducts(getProducts().filter(p => p.id !== id));
  renderList();
}
window.deleteMueble = deleteMueble;

function resetForm() {
  ['editId','mName','mMaterial','mDesc','mImgUrl'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('mCat').value = 'Mesas';
  document.getElementById('mImgFile').value = '';
  document.getElementById('mPreview').style.display = 'none';
  document.getElementById('formTitle').textContent = 'Agregar Mueble';
  document.getElementById('cancelBtn').style.display = 'none';
  currentImgData = null;
}
window.resetForm = resetForm;

function renderList() {
  const products = getProducts();
  const list = document.getElementById('muebleList');
  document.getElementById('countBadge').textContent = products.length;
  if (!products.length) {
    list.innerHTML = '<p class="admin-list-empty">No hay muebles aún. ¡Agregá el primero!</p>';
    return;
  }
  list.innerHTML = products.map(p => `
    <div class="admin-list-item">
      <img src="${p.image}" alt="${p.name}" class="admin-list-img" onerror="this.src='assets/logo.svg'">
      <div class="admin-list-info">
        <div class="admin-list-name">${p.name}</div>
        <div class="admin-list-meta">${p.category} · ${p.material || ''}</div>
      </div>
      <div class="admin-list-actions">
        <button class="admin-btn-edit" onclick="editMueble('${p.id}')">Editar</button>
        <button class="admin-btn-del" onclick="deleteMueble('${p.id}')">Eliminar</button>
      </div>
    </div>
  `).join('');
}

function showMsg(id, text, type) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = 'admin-msg ' + type;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}
