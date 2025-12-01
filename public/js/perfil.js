async function carregar() {
  const STORAGE_KEY = 'zwitter_perfil';
  const perfil = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const perfilContainer = document.getElementById('perfil-container');
  const postsContainer = document.getElementById('user-posts');

  if (!perfil) {
    perfilContainer.innerHTML = `<div class="text-center py-5"><h3>Crie sua conta</h3><a href="cadastro.html" class="btn btn-primary px-5 py-3">Criar agora</a></div>`;
    postsContainer.innerHTML = '';
    return;
  }

  let posts = [];
  try {
    const res = await fetch('http://localhost:3000/posts');
    posts = await res.json();
  } catch {
    posts = [];
  }

  const meusPosts = posts.filter(p => String(p.userId) === String(perfil.id)).sort((a,b) => Number(b.id) - Number(a.id));

  perfilContainer.innerHTML = `
    <div class="profile-header"></div>
    <div class="profile-card">
      <div class="profile-avatar"><img src="${perfil.foto || 'img/perfil.jpg'}" alt="${perfil.nome}"></div>
      <div class="profile-info">
        <h1>${perfil.nome}</h1>
        <p class="arroba">${perfil.arroba}</p>
        <p class="email">${perfil.email}</p>
        <div class="profile-actions">
          <a href="cadastro.html" class="btn btn-edit">Editar Perfil</a>
          <a href="criar-post.html" class="btn btn-newpost">Novo Post</a>
          <button class="btn btn-logout" id="btn-logout">Sair</button>
        </div>
      </div>
    </div>`;

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', () => { if (confirm('Sair da conta?')) { localStorage.removeItem('zwitter_perfil'); location.href='index.html' } });

  if (meusPosts.length === 0) {
    postsContainer.innerHTML = '<div class="no-posts">Você ainda não postou nada.<br><a href="criar-post.html" style="color:#1d9bf0">Faça seu primeiro post!</a></div>';
    return;
  }

  postsContainer.innerHTML = '<h4 class="mt-5 mb-3">Seus Posts</h4>' + meusPosts.map(p => `
    <div class="post-item">
      <strong>${p.username}</strong> <span class="text-muted">${p.handle} · ${p.date}</span>
      <p class="my-2">${p.text}</p>
      ${p.image ? `<img src="${p.image}" class="img-fluid rounded mb-3">` : ''}
      <div class="mt-3 d-flex gap-3">
        <a href="detalhes.html?id=${p.id}" class="highlight-button">Ver detalhes</a>
        <button class="btn-delete" data-post-id="${p.id}">Excluir Post</button>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = btn.getAttribute('data-post-id');
      if (!confirm('Excluir este post permanentemente?')) return;
      try {
        const res = await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
        if (res.ok) carregar();
        else alert('Erro ao excluir o post');
      } catch {
        alert('Erro de conexão ao excluir o post');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', carregar);
