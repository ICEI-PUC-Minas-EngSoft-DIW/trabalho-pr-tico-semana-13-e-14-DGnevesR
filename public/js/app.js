let posts = [];

async function loadPosts() {
  const res = await fetch('http://localhost:3000/posts');
  posts = await res.json();
  posts.sort((a, b) => b.id - a.id);
  renderFeed();
  renderCarousel();
}

function renderFeed() {
  const feed = document.querySelector('.feed');
  if (!feed || (!window.location.pathname.includes('index.html') && window.location.pathname !== '/')) return;

  feed.innerHTML = posts.map(p => `
    <div class="post mb-4 p-3 border rounded bg-dark">
      <p class="mb-1"><strong>${p.username}</strong> <span class="text-muted">${p.handle} · ${p.date}</span></p>
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}" class="img-fluid rounded mb-2" style="max-height:500px;">` : ''}
      <div class="text-muted small">Like ${p.likes} · Retweet ${p.retweets} · Comment ${p.comments.length}</div>
      <a href="detalhes.html?id=${p.id}" class="btn btn-outline-primary btn-sm mt-2">Ver detalhes</a>
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
        <img src="${p.image || 'img/placeholder.jpg'}" class="d-block w-100" style="height:400px;object-fit:cover;">
        <div class="carousel-caption d-none d-md-block">
          <h5>${p.username}</h5>
          <p>${p.text.substring(0,80)}...</p>
          <a href="detalhes.html?id=${p.id}" class="btn btn-primary btn-sm">Ver post</a>
        </div>
      </div>`;
  });
}

function getPostId() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

async function renderPostDetails() {
  if (!window.location.pathname.includes('detalhes.html')) return;

  const id = getPostId();
  if (!id) {
    document.getElementById('post-details').innerHTML = '<p class="text-center">Post não encontrado.</p>';
    return;
  }

  if (posts.length === 0) await loadPosts();

  let post = posts.find(p => p.id === id);
  if (!post) {
    const res = await fetch(`http://localhost:3000/posts/${id}`);
    if (res.ok) post = await res.json();
  }

  if (!post) {
    document.getElementById('post-details').innerHTML = '<p class="text-center">Post não encontrado.</p>';
    return;
  }

  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');

  document.getElementById('post-details').innerHTML = `
    <div class="post-detail-card p-4 bg-dark rounded border">
      <div class="d-flex mb-3">
        <img src="${perfil?.foto || 'img/perfil.jpg'}" class="rounded-circle me-3" width="60" height="60">
        <div>
          <h4>${post.username}</h4>
          <p class="text-muted">${post.handle} · ${post.date}</p>
        </div>
      </div>
      <p class="fs-5">${post.text}</p>
      ${post.image ? `<img src="${post.image}" class="img-fluid rounded my-3" style="max-height:600px;">` : ''}
      <p style="color:#aaa;font-size:0.95rem;margin-top:12px;">
        Like ${post.likes} · Retweet ${post.retweets} · Comment ${post.comments.length}
      </p>
    </div>`;

  document.getElementById('linked-photos').innerHTML = '';

  const commentsDiv = document.getElementById('comments-section');
  commentsDiv.innerHTML = post.comments.length === 0
    ? '<p class="text-muted">Nenhum comentário.</p>'
    : post.comments.map(c => `
      <div class="border-bottom pb-3 mb-3">
        <strong>${c.username}</strong> <small class="text-muted">${c.handle} · ${c.date}</small>
        <p class="mt-1 mb-0">${c.text}</p>
      </div>
    `).join('');

  const input = document.getElementById('novo-comentario');
  const btn = document.getElementById('enviar-comentario');

  if (!perfil.nome) {
    if (input) input.disabled = true;
    if (btn) btn.disabled = true;
    commentsDiv.insertAdjacentHTML('beforeend', '<p class="text-center text-muted">Faça login para comentar.</p>');
    return;
  }

  btn.onclick = async () => {
    const texto = input.value.trim();
    if (!texto) return;

    const novo = {
      username: perfil.nome,
      handle: perfil.arroba,
      text: texto,
      date: new Date().toISOString().split('T')[0]
    };

    post.comments.push(novo);

    await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({comments: post.comments})
    });

    input.value = '';
    renderPostDetails();
  };
}

function updateSidebar() {
  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');
  document.querySelectorAll('.nome-sidebar').forEach(el => el.textContent = perfil.nome || 'user.maneiro');
  document.querySelectorAll('.arroba-sidebar').forEach(el => el.textContent = perfil.arroba || '@user.bolado');
  document.querySelectorAll('.avatar-sidebar, #avatar-sidebar').forEach(img => img.src = perfil.foto || 'img/perfil.jpg');
}

document.addEventListener('DOMContentLoaded', () => {
  updateSidebar();

  if (window.location.pathname.includes('detalhes.html')) {
    renderPostDetails();
  } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    loadPosts();
  }
});