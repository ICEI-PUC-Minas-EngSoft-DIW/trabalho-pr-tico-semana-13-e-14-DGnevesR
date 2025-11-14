let posts = [];

async function loadPosts() {
  try {
    const res = await fetch('http://localhost:3000/posts');
    if (!res.ok) throw new Error('API offline');
    posts = await res.json();
    renderPosts();
    renderCarousel();
    renderPostDetails();
    updateProfileInfo();
  } catch (err) {
    console.error(err);
  }
}

function updateProfileInfo() {
  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil'));
  if (perfil) {
    document.querySelectorAll('.info .nome').forEach(el => el.textContent = perfil.nome);
    document.querySelectorAll('.info .arroba').forEach(el => el.textContent = perfil.arroba);
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
  posts.forEach((p, i) => {
    const active = i === 0 ? 'active' : '';
    indicators.innerHTML += `<button type="button" data-bs-target="#highlightCarousel" data-bs-slide-to="${i}" class="${active}"></button>`;
    inner.innerHTML += `
      <div class="carousel-item ${active}">
        <img src="${p.image}" class="d-block w-100" alt="${p.username}" style="max-height:400px;object-fit:cover;">
        <div class="carousel-caption d-block">
          <h5>${p.username}</h5>
          <p>${p.text.substring(0,100)}${p.text.length > 100 ? '...' : ''}</p>
          <a href="detalhes.html?id=${p.id}" class="highlight-button">Ver mais</a>
        </div>
      </div>
    `;
  });
}

function renderPostDetails() {
  if (!window.location.pathname.includes('detalhes.html')) return;
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get('id'));
  const post = posts.find(p => p.id === id);
  if (!post) return;

  document.getElementById('post-details').innerHTML = `
    <p><strong>Usuário:</strong> ${post.username} (${post.handle})</p>
    <p><strong>Data:</strong> ${post.date}</p>
    <p><strong>Texto:</strong> ${post.text}</p>
    ${post.image ? `<img src="${post.image}" alt="Post">` : ''}
    <p><strong>Engajamento:</strong> ❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}</p>
  `;

  document.getElementById('linked-photos').innerHTML = post.image ? `
    <div class="photo-card"><img src="${post.image}" alt="Foto"><h5>Foto de ${post.username}</h5></div>
  ` : '<p>Sem fotos.</p>';

  const comments = document.getElementById('comments-section');
  comments.innerHTML = post.comments.map(c => `
    <div class="comment"><p><strong>${c.username}</strong> ${c.handle} · ${c.date}</p><p>${c.text}</p></div>
  `).join('') || '<p>Sem comentários.</p>';

  document.getElementById('enviar-comentario').onclick = async () => {
    const text = document.getElementById('novo-comentario').value.trim();
    if (!text) return;
    const comment = { username: "user.maneiro", handle: "@user.bolado", text, date: new Date().toISOString().split('T')[0] };
    post.comments.push(comment);
    await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comments: post.comments })
    });
    renderPostDetails();
    document.getElementById('novo-comentario').value = '';
  };
}

document.addEventListener('DOMContentLoaded', loadPosts);