const STORAGE_KEY = 'ghost-v0.7A-state';
let state = loadState();
let currentAlbumId = state.albums[0]?.id || null;
let currentPhotoIndex = 0;
let touchStartX = 0;
let touchStartY = 0;

const $ = id => document.getElementById(id);
const screens = { home: $('homeScreen'), album: $('albumScreen'), viewer: $('viewerScreen') };

function uid(prefix) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`; }
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return { albums: [{ id: uid('album'), name: 'Family Album', coverPhotoId: null, photos: [] }] };
}
function saveState() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function album() { return state.albums.find(a => a.id === currentAlbumId) || state.albums[0]; }
function photo() { return album()?.photos[currentPhotoIndex]; }
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

function renderAlbums() {
  const grid = $('albumGrid');
  grid.innerHTML = '';
  state.albums.forEach(a => {
    const cover = a.photos.find(p => p.id === a.coverPhotoId) || a.photos[0];
    const card = document.createElement('button');
    card.className = 'album-card';
    card.innerHTML = `${cover ? `<img src="${cover.data}" alt="${a.name} cover">` : ''}<div class="album-meta"><h3>${escapeHtml(a.name)}</h3><p>${a.photos.length} photo${a.photos.length === 1 ? '' : 's'}</p></div>`;
    card.onclick = () => openAlbum(a.id);
    grid.appendChild(card);
  });
}

function openAlbum(id) {
  currentAlbumId = id;
  renderAlbum();
  showScreen('album');
}

function renderAlbum() {
  const a = album();
  $('albumTitle').textContent = a.name;
  $('albumCount').textContent = `${a.photos.length} photo${a.photos.length === 1 ? '' : 's'}`;
  const grid = $('photoGrid');
  grid.innerHTML = '';
  if (!a.photos.length) {
    grid.innerHTML = '<div class="empty">Add photos to this album and the first one becomes the cover automatically.</div>';
    return;
  }
  a.photos.forEach((p, i) => {
    const btn = document.createElement('button');
    btn.className = 'photo-tile';
    btn.innerHTML = `<img src="${p.data}" alt="${escapeHtml(p.name)}">`;
    btn.onclick = () => openViewer(i);
    grid.appendChild(btn);
  });
}

function openViewer(index) {
  currentPhotoIndex = index;
  $('viewerTopbar').classList.remove('hidden-ui');
  $('viewerMenu').classList.add('hidden');
  updateViewer();
  screens.viewer.classList.add('active');
}
function closeViewer() {
  screens.viewer.classList.remove('active');
  $('viewerMenu').classList.add('hidden');
  renderAlbum();
  renderAlbums();
}
function updateViewer() {
  const a = album();
  const p = photo();
  if (!p) return closeViewer();
  $('viewerImage').src = p.data;
  $('viewerCounter').textContent = `${currentPhotoIndex + 1} / ${a.photos.length}`;
}
function nextPhoto() { if (currentPhotoIndex < album().photos.length - 1) { currentPhotoIndex++; updateViewer(); } }
function prevPhoto() { if (currentPhotoIndex > 0) { currentPhotoIndex--; updateViewer(); } }

async function addPhotos(files, albumId = currentAlbumId) {
  const a = state.albums.find(x => x.id === albumId);
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    const data = await fileToDataUrl(file);
    const p = { id: uid('photo'), name: file.name, type: file.type, size: file.size, added: new Date().toISOString(), data };
    a.photos.push(p);
    if (!a.coverPhotoId) a.coverPhotoId = p.id;
  }
  saveState(); renderAlbums(); renderAlbum();
}
function fileToDataUrl(file) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); }); }

function setAlbumCover() {
  const a = album(); const p = photo();
  a.coverPhotoId = p.id;
  saveState();
  $('viewerMenu').classList.add('hidden');
  toast('Album cover updated');
}
function deletePhoto() {
  const a = album(); const p = photo();
  if (!confirm('Delete photo?')) return;
  a.photos.splice(currentPhotoIndex, 1);
  if (a.coverPhotoId === p.id) a.coverPhotoId = a.photos[0]?.id || null;
  if (currentPhotoIndex >= a.photos.length) currentPhotoIndex = Math.max(0, a.photos.length - 1);
  saveState();
  $('viewerMenu').classList.add('hidden');
  if (!a.photos.length) closeViewer(); else updateViewer();
}
function showMoveDialog() {
  const list = $('moveAlbumList'); list.innerHTML = '';
  state.albums.filter(a => a.id !== currentAlbumId).forEach(a => {
    const btn = document.createElement('button');
    btn.textContent = `${a.name} (${a.photos.length})`;
    btn.onclick = e => { e.preventDefault(); moveCurrentPhoto(a.id); $('moveDialog').close(); };
    list.appendChild(btn);
  });
  if (!list.children.length) list.innerHTML = '<p>No other albums yet. Create another album first.</p>';
  $('viewerMenu').classList.add('hidden');
  $('moveDialog').showModal();
}
function moveCurrentPhoto(destAlbumId) {
  const source = album(); const dest = state.albums.find(a => a.id === destAlbumId); const p = photo();
  source.photos.splice(currentPhotoIndex, 1);
  if (source.coverPhotoId === p.id) source.coverPhotoId = source.photos[0]?.id || null;
  dest.photos.push(p);
  if (!dest.coverPhotoId) dest.coverPhotoId = p.id;
  saveState();
  if (currentPhotoIndex >= source.photos.length) currentPhotoIndex = Math.max(0, source.photos.length - 1);
  if (!source.photos.length) closeViewer(); else updateViewer();
}
function showInfo() {
  const p = photo();
  $('photoInfo').innerHTML = `<div><b>Filename</b><br>${escapeHtml(p.name)}</div><div><b>Date Added</b><br>${new Date(p.added).toLocaleString()}</div><div><b>Album</b><br>${escapeHtml(album().name)}</div><div><b>Size</b><br>${formatSize(p.size)}</div><div><b>Type</b><br>${escapeHtml(p.type || 'image')}</div>`;
  $('viewerMenu').classList.add('hidden');
  $('infoDialog').showModal();
}
function formatSize(bytes) { if (!bytes) return 'Unknown'; const mb = bytes / 1024 / 1024; return mb >= 1 ? `${mb.toFixed(2)} MB` : `${(bytes / 1024).toFixed(1)} KB`; }
function escapeHtml(s) { return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function toast(message) { const old = document.querySelector('.toast'); if (old) old.remove(); const el = document.createElement('div'); el.className='toast'; el.textContent=message; Object.assign(el.style,{position:'fixed',bottom:'28px',left:'50%',transform:'translateX(-50%)',background:'#22102f',color:'white',padding:'12px 16px',borderRadius:'999px',zIndex:50}); document.body.appendChild(el); setTimeout(()=>el.remove(),1500); }

$('newAlbumBtn').onclick = () => $('albumDialog').showModal();
$('createAlbumConfirm').onclick = e => { e.preventDefault(); const name = $('albumNameInput').value.trim(); if (!name) return; state.albums.push({ id: uid('album'), name, coverPhotoId: null, photos: [] }); $('albumNameInput').value=''; saveState(); renderAlbums(); $('albumDialog').close(); };
$('photoInput').onchange = e => addPhotos([...e.target.files], state.albums[0].id);
$('albumPhotoInput').onchange = e => addPhotos([...e.target.files], currentAlbumId);
$('backToHome').onclick = () => { renderAlbums(); showScreen('home'); };
$('closeViewer').onclick = closeViewer;
$('viewerMenuBtn').onclick = e => { e.stopPropagation(); $('viewerMenu').classList.toggle('hidden'); };
$('setCoverBtn').onclick = setAlbumCover;
$('deletePhotoBtn').onclick = deletePhoto;
$('movePhotoBtn').onclick = showMoveDialog;
$('photoInfoBtn').onclick = showInfo;
$('viewerImage').onclick = () => { if (!$('viewerMenu').classList.contains('hidden')) { $('viewerMenu').classList.add('hidden'); return; } $('viewerTopbar').classList.toggle('hidden-ui'); };
$('viewerScreen').addEventListener('click', e => { if (!e.target.closest('#viewerMenu') && !e.target.closest('#viewerMenuBtn')) $('viewerMenu').classList.add('hidden'); });
$('viewerScreen').addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; touchStartY = e.changedTouches[0].clientY; }, {passive:true});
$('viewerScreen').addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - touchStartX; const dy = e.changedTouches[0].clientY - touchStartY; if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? nextPhoto() : prevPhoto(); }, {passive:true});
document.addEventListener('keydown', e => { if (!screens.viewer.classList.contains('active')) return; if (e.key === 'ArrowRight') nextPhoto(); if (e.key === 'ArrowLeft') prevPhoto(); if (e.key === 'Escape') closeViewer(); });

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
renderAlbums();
