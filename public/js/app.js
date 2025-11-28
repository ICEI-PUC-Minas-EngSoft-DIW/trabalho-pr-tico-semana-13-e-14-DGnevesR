let posts = [];

function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return parseInt(urlParams.get('id'));
}

async function renderPostDetails() {
  if (!window.location.pathname.includes('detalhes.html')) return;

  const postId = getPostIdFromUrl();
  if (!postId) {
    document.getElementById('post-details').innerHTML = '<p>Post não encontrado (ID inválido).</p>';
    return;
  }

  if (posts.length === 0) {
    await loadPosts();
    return;
  }

  const post = posts.find(p => p.id === postId);
  const container = document.getElementById('post-details');
  const linkedPhotos = document.getElementById('linked-photos');
  const commentsSection = document.getElementById('comments-section');

  if (!post || !container) {
    container.innerHTML = '<p>Post não encontrado.</p>';
    return;
  }

  container.innerHTML = `
    <div class="post-header mb-3 d-flex align-items-center">
      <img src="img/perfil.jpg" alt="${post.username}" class="avatar-sidebar me-3" style="width:56px;height:56px;">
      <div>
        <p class="mb-0"><strong>${post.username}</strong></p>
        <p class="text-muted mb-0">${post.handle} · ${post.date}</p>
      </div>
    </div>
    <p class="fs-5">${post.text}</p>
    ${post.image ? `<img src="${post.image}" alt="Imagem do post" class="img-fluid rounded">` : ''}
    <div class="mt-3 text-muted">
      ❤️ ${post.likes} likes · 🔄 ${post.retweets} reposts · 💬 ${post.comments.length} comentários
    </div>
  `;

  linkedPhotos.innerHTML = post.image ? `
    <h4 class="mb-3">Fotos deste post</h4>
    <div class="photo-card p-3 bg-dark rounded">
      <img src="${post.image}" class="img-fluid rounded" alt="Foto de ${post.username}">
      <p class="mt-2 mb-0">Foto postada por ${post.username}</p>
    </div>
  ` : '<p>Sem fotos vinculadas.</p>';

  commentsSection.innerHTML = post.comments.length === 0 
    ? '<p class="text-muted">Seja o primeiro a comentar!</p>'
    : post.comments.map(c => `
        <div class="comment">
          <p><strong>${c.username}</strong> <span class="text-muted">${c.handle} · ${c.date}</span></p>
          <p>${c.text}</p>
        </div>
      `).join('');

  const btn = document.getElementById('enviar-comentario');
  const input = document.getElementById('novo-comentario');
  if (btn && input) {
    btn.onclick = async () => {
      const text = input.value.trim();
      if (!text) return;

      const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');
      const novoComentario = {
        username: perfil.nome || "Usuário",
        handle: perfil.arroba || "@usuario",
        text,
        date: new Date().toISOString().split('T')[0]
      };

      post.comments.push(novoComentario);

      await fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comments: post.comments })
      });

      renderPostDetails();
      input.value = '';
    };
  }
}

function renderPosts() {
  if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') return;
  const feed = document.querySelector('.feed');
  if (!feed) return;
  feed.innerHTML = '';
  posts.forEach(post => {
    const el = document.createElement('div');
    el.className = 'post';
    el.innerHTML = `
      <p><strong>${post.username}</strong> ${post.handle} · ${post.date}</p>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" alt="Post">` : ''}
      <p>❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}</p>
      <a href="detalhes.html?id=${post.id}" class="highlight-button">Ver detalhes</a>
    `;
    feed.appendChild(el);
  });
}

function renderCarousel() {
  if (!window.location.pathname.includes('index.html') && window.location.pathname !== '/') return;
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
        <img src="${p.image || 'img/placeholder.jpg'}" class="d-block w-100" alt="${p.username}" style="max-height:400px;object-fit:cover;">
        <div class="carousel-caption d-block">
          <h5>${p.username}</h5>
          <p>${p.text.substring(0,100)}${p.text.length > 100 ? '...' : ''}</p>
          <a href="detalhes.html?id=${p.id}" class="highlight-button">Ver mais</a>
        </div>
      </div>
    `;
  });
}

function updateProfileInfo() {
  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');
  document.querySelectorAll('.nome-sidebar').forEach(el => el.textContent = perfil.nome || 'user.maneiro');
  document.querySelectorAll('.arroba-sidebar').forEach(el => el.textContent = perfil.arroba || '@user.bolado');
}

async function loadPosts() {
  try {
    const res = await fetch('http://localhost:3000/posts');
    if (!res.ok) throw new Error('API offline');
    posts = await res.json();
    posts.sort((a, b) => b.id - a.id);

    renderPosts();
    renderCarousel();
    updateProfileInfo();

    if (window.location.pathname.includes('detalhes.html')) {
      renderPostDetails();
    }
  } catch (err) {
    console.error(err);
    if (window.location.pathname.includes('detalhes.html')) {
      document.getElementById('post-details')?.insertAdjacentHTML('beforeend', 
        '<p class="text-danger">Erro ao carregar o post.</p>'
      );
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
});