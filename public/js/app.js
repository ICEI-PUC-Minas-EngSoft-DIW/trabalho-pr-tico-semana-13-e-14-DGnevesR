let posts = [];
let currentUser = null;

function getCurrentUser() {
  const user = localStorage.getItem('zwitter_perfil');
  return user ? JSON.parse(user) : null;
}

function updateAuthUI() {
  currentUser = getCurrentUser();
  const isLoggedIn = !!currentUser;

  document.querySelectorAll('#nav-favoritos, #mobile-favoritos, #desktop-favoritos')
    .forEach(el => el.classList.toggle('d-none', !isLoggedIn));

  document.querySelectorAll('#mobile-logout, #desktop-logout')
    .forEach(el => {
      el.classList.toggle('d-none', !isLoggedIn);
      if (isLoggedIn) {
        el.onclick = () => {
          if (confirm('Sair da conta?')) {
            localStorage.removeItem('zwitter_perfil');
            location.href = 'index.html';
          }
        };
      }
    });

  const nome = isLoggedIn ? currentUser.nome : 'Visitante';
  const arroba = isLoggedIn ? currentUser.arroba : '@convidado';
  const foto = isLoggedIn && currentUser.foto ? currentUser.foto : 'img/perfil.jpg';

  document.querySelectorAll('.nome-sidebar, #mobile-nome, #desktop-nome')
    .forEach(el => el.textContent = nome);

  document.querySelectorAll('.arroba-sidebar, #mobile-arroba, #desktop-arroba')
    .forEach(el => el.textContent = arroba);

  document.querySelectorAll('.avatar-sidebar, #mobile-avatar, #desktop-avatar')
    .forEach(img => img.src = foto);
}

function getFavorites() {
  const favs = localStorage.getItem('zwitter_favoritos');
  try {
    return favs ? JSON.parse(favs).map(n => Number(n)) : [];
  } catch {
    return [];
  }
}

function isFavorite(postId) {
  return getFavorites().includes(Number(postId));
}

function toggleFavorite(postId) {
  currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Faça login para favoritar posts');
    return;
  }

  let favorites = getFavorites();
  postId = Number(postId);

  const index = favorites.indexOf(postId);

  if (index === -1) favorites.push(postId);
  else favorites = favorites.filter(id => id !== postId);

  localStorage.setItem('zwitter_favoritos', JSON.stringify(favorites));

  document.querySelectorAll(`[data-post-id="${postId}"]`)
    .forEach(btn => {
      btn.classList.toggle('active', isFavorite(postId));
      btn.innerHTML = isFavorite(postId) ? '♥' : '♡';
    });

  if (window.location.pathname.includes('favoritos.html')) loadFavorites();
}

async function loadPosts() {
  try {
    const res = await fetch('http://localhost:3000/posts');
    posts = await res.json();
    posts.sort((a, b) => Number(b.id) - Number(a.id));

    if (
      !window.location.pathname.includes('detalhes.html') &&
      !window.location.pathname.includes('favoritos.html')
    ) {
      renderPosts();
      renderCarousel();
    }
  } catch (err) {}
}

function renderPosts(list = posts) {
  const container = document.getElementById('posts-container') || document.querySelector('.feed');
  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = '<p class="text-center text-muted p-5">Nenhum post encontrado.</p>';
    return;
  }

  container.innerHTML = list.map(p => `
    <div class="post">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <div class="flex-fill">
          <p class="mb-1"><strong>${p.username}</strong> <span class="text-muted">${p.handle} · ${p.date}</span></p>
          <p>${p.text}</p>
          ${p.image ? `<img src="${p.image}" class="img-fluid rounded mb-3" style="max-height:500px;object-fit:cover">` : ""}
        </div>
        <button class="favorite-btn ${isFavorite(p.id) ? "active" : ""}"
                data-post-id="${p.id}"
                onclick="toggleFavorite(${p.id})">
          ${isFavorite(p.id) ? "♥" : "♡"}
        </button>
      </div>
      <a href="detalhes.html?id=${p.id}" class="highlight-button">Ver detalhes</a>
    </div>
  `).join('');
}

function renderCarousel() {
  const inner = document.querySelector('#highlightCarousel .carousel-inner');
  const indicators = document.querySelector('#highlightCarousel .carousel-indicators');
  if (!inner || !indicators) return;

  inner.innerHTML = '';
  indicators.innerHTML = '';

  posts.slice(0, 5).forEach((p, i) => {
    const active = i === 0 ? 'active' : '';
    indicators.innerHTML += `<button type="button" data-bs-target="#highlightCarousel" data-bs-slide-to="${i}" class="${active}"></button>`;
    inner.innerHTML += `
      <div class="carousel-item ${active}">
        <img src="${p.image}" class="d-block w-100" style="height:400px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block">
          <h5>${p.username}</h5>
          <p>${p.text.substring(0,80)}...</p>
          <a href="detalhes.html?id=${p.id}" class="btn btn-primary btn-sm">Ver post</a>
        </div>
      </div>
    `;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  loadPosts();
});

window.toggleFavorite = toggleFavorite;
window.isFavorite = isFavorite;
