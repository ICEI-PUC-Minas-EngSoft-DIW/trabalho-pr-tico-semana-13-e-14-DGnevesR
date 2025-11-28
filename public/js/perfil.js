const STORAGE_KEY = 'zwitter_perfil';
let posts = [];

async function carregar() {
  const perfil = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const res = await fetch('http://localhost:3000/posts');
  posts = await res.json();
  renderizarPerfil(perfil);
  renderizarPosts(perfil);
}

function renderizarPerfil(perfil) {
  const container = document.getElementById('perfil-container');
  
  if (!perfil) {
    container.innerHTML = `
      <div class="text-center py-5">
        <h3 class="text-white mb-4">Você ainda não tem uma conta</h3>
        <a href="cadastro.html" class="btn btn-primary px-5 py-3">Criar conta agora</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="profile-header"></div>
    <div class="profile-card">
      <div class="profile-avatar">
        <img src="${perfil.foto || 'img/perfil.jpg'}" alt="${perfil.nome}">
      </div>
      <div class="profile-info">
        <h1>${perfil.nome}</h1>
        <p class="arroba">${perfil.arroba}</p>
        <p class="email">${perfil.email}</p>
        <div class="profile-actions">
          <a href="cadastro.html" class="btn btn-edit">Editar Perfil</a>
          <a href="criar-post.html" class="btn btn-newpost">Novo Post</a>
          <button id="btn-logout" class="btn btn-logout">Sair da conta</button>
        </div>
      </div>
    </div>`;

  document.getElementById('btn-logout').onclick = () => {
    if (confirm('Tem certeza que deseja sair da conta?')) {
      localStorage.removeItem(STORAGE_KEY);
      location.href = 'index.html';
    }
  };
}

function renderizarPosts(perfil) {
  if (!perfil) return;
  
  const container = document.getElementById('user-posts');
  const meusPosts = posts.filter(p => p.userId === perfil.id);

  if (meusPosts.length === 0) {
    container.innerHTML = '<div class="no-posts">Você ainda não fez nenhum post.<br><a href="criar-post.html" style="color:#1d9bf0">Faça o seu primeiro post agora!</a></div>';
    return;
  }

  container.innerHTML = '<div class="posts-section"><h4>Seus Posts</h4></div>' + 
    meusPosts.map(p => `
      <div class="post-item">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <strong>${p.username}</strong>
            <span class="text-muted ms-2">${p.handle} · ${p.date}</span>
          </div>
        </div>
        <p class="mb-3">${p.text}</p>
        ${p.image ? `<img src="${p.image}" class="img-fluid mb-3" alt="Post">` : ''}
        <div class="text-muted small mb-3">
          ❤️ ${p.likes} likes · 🔄 ${p.retweets} reposts · 💬 ${p.comments.length} comentários
        </div>
        <button class="btn btn-delete btn-sm" onclick="excluirPost(${p.id})">Excluir Post</button>
      </div>
    `).join('');
}

async function excluirPost(id) {
  if (!confirm('Tem certeza que quer excluir este post?')) return;
  await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
  carregar();
}

document.addEventListener('DOMContentLoaded', carregar);