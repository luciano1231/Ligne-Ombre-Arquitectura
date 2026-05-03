/* ================================================
   LIGNE & OMBRE STUDIO — Admin Arquitectura JS
   ================================================ */

const PASS     = 'studio2024';
const STOR_KEY = 'los_portfolio';

const DEFAULT_PROJECTS = [
  { id:'1', title:'Residencia Nativa', category:'Residencial', year:'2023', description:'Casa de campo de 380m² integrada al paisaje correntino. Diseño bioclimático con materiales naturales, amplias aberturas y vegetación local. Premio ARQ Award 2023.', image:'assets/img/proyecto-1.png' },
  { id:'2', title:'Loft Baires', category:'Interiorismo', year:'2023', description:'Reforma integral de loft industrial en Buenos Aires. 220m² de planta libre con materiales premium.', image:'assets/img/proyecto-2.png' },
  { id:'3', title:'Torre Meridian', category:'Comercial', year:'2022', description:'Edificio de oficinas corporativas de 12 plantas en Posadas. Certificación LEED Silver.', image:'assets/img/proyecto-3.png' }
];

function getProjects() {
  const s = localStorage.getItem(STOR_KEY);
  if (s) { try { return JSON.parse(s); } catch {} }
  return DEFAULT_PROJECTS;
}
function saveProjects(p) { localStorage.setItem(STOR_KEY, JSON.stringify(p)); }

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
  const preview = document.getElementById(previewId);
  if (!input.files || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    currentImgData = e.target.result;
    preview.style.display = 'block';
    document.getElementById(previewId + 'Img').src = e.target.result;
  };
  reader.readAsDataURL(input.files[0]);
}
window.previewImage = previewImage;

function saveProject() {
  const id    = document.getElementById('editId').value;
  const title = document.getElementById('pTitle').value.trim();
  const cat   = document.getElementById('pCat').value;
  const year  = document.getElementById('pYear').value.trim();
  const desc  = document.getElementById('pDesc').value.trim();
  const url   = document.getElementById('pImgUrl').value.trim();

  if (!title) return showMsg('formMsg', 'El título es obligatorio.', 'err');

  const image = currentImgData || url || 'assets/img/proyecto-1.png';

  let projects = getProjects();
  if (id) {
    projects = projects.map(p => p.id === id ? { id, title, category: cat, year, description: desc, image } : p);
    showMsg('formMsg', '✓ Proyecto actualizado correctamente.', 'ok');
  } else {
    const newP = { id: Date.now().toString(), title, category: cat, year, description: desc, image };
    projects.push(newP);
    showMsg('formMsg', '✓ Proyecto agregado al portafolio.', 'ok');
  }
  saveProjects(projects);
  resetForm();
  renderList();
}
window.saveProject = saveProject;

function editProject(id) {
  const p = getProjects().find(x => x.id === id);
  if (!p) return;
  document.getElementById('editId').value  = p.id;
  document.getElementById('pTitle').value  = p.title;
  document.getElementById('pCat').value    = p.category;
  document.getElementById('pYear').value   = p.year || '';
  document.getElementById('pDesc').value   = p.description;
  document.getElementById('pImgUrl').value = p.image;
  document.getElementById('formTitle').textContent = 'Editar Proyecto';
  document.getElementById('cancelBtn').style.display = 'inline-flex';
  currentImgData = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.editProject = editProject;

function deleteProject(id) {
  if (!confirm('¿Eliminar este proyecto del portafolio?')) return;
  const updated = getProjects().filter(p => p.id !== id);
  saveProjects(updated);
  renderList();
}
window.deleteProject = deleteProject;

function resetForm() {
  ['editId','pTitle','pYear','pDesc','pImgUrl'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('pCat').value = 'Residencial';
  document.getElementById('pImgFile').value = '';
  document.getElementById('pPreview').style.display = 'none';
  document.getElementById('formTitle').textContent = 'Agregar Proyecto';
  document.getElementById('cancelBtn').style.display = 'none';
  currentImgData = null;
}
window.resetForm = resetForm;

function renderList() {
  const projects = getProjects();
  const list = document.getElementById('projectList');
  document.getElementById('countBadge').textContent = projects.length;
  if (!projects.length) {
    list.innerHTML = '<p class="admin-list-empty">No hay proyectos aún. ¡Agregá el primero!</p>';
    return;
  }
  list.innerHTML = projects.map(p => `
    <div class="admin-list-item">
      <img src="${p.image}" alt="${p.title}" class="admin-list-img" onerror="this.src='assets/logo.svg'">
      <div class="admin-list-info">
        <div class="admin-list-name">${p.title}</div>
        <div class="admin-list-meta">${p.category} · ${p.year || 's/f'}</div>
      </div>
      <div class="admin-list-actions">
        <button class="admin-btn-edit" onclick="editProject('${p.id}')">Editar</button>
        <button class="admin-btn-del" onclick="deleteProject('${p.id}')">Eliminar</button>
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
