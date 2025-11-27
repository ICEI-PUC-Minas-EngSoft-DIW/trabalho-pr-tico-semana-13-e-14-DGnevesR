const STORAGE_KEY = 'zwitter_perfil';
let posts = [];

async function loadData() {
  const perfil = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const res = await fetch('http://localhost:3000/posts');
  posts = await res.json();

  renderPerfil(perfil);
  renderUserPosts(perfil);
}

function renderPerfil(perfil) {
  const container = document.getElementById('perfil-container');
  if (!perfil) {
    container.innerHTML = `
      <div class="text-center p-5 bg-dark rounded">
        <h3>Nenhum perfil cadastrado</h3>
        <a href="cadastro.html" class="btn btn-primary mt-3">Fazer Cadastro</a>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="perfil-card">
      <div class="avatar">
        <img src="img/perfil.jpg" alt="Foto de perfil">
      </div>
      <div class="info">
        <h2 class="nome">${perfil.nome}</h2>
        <p class="arroba">${perfil.arroba}</p>
        <p class="email">${perfil.email}</p>
        <div class="acoes mt-3">
          <a href="cadastro.html" class="btn btn-outline-primary">Editar Perfil</a>
          <a href="criar-post.html" class="btn btn-primary ms-2">Novo Post</a>
        </div>
      </div>
    </div>`;
}

function renderUserPosts(perfil) {
  if (!perfil) return;
  const container = document.getElementById('user-posts');
  const userPosts = posts.filter(p => p.userId === perfil.arroba);

  if (userPosts.length === 0) {
    container.innerHTML = '<p class="text-center text-muted">Você ainda não fez nenhum post.</p>';
    return;
  }

  container.innerHTML = '<h4 class="mb-4">Seus Posts</h4>' + userPosts.map(post => `
    <div class="post">
      <p><strong>${post.username}</strong> ${post.handle} · ${post.date}</p>
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" alt="Post">` : ''}
      <p>❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}</p>
      <button class="delete-btn" onclick="deletarPost(${post.id})">Excluir Post</button>
    </div>
  `).join('');
}

async function deletarPost(id) {
  if (!confirm('Tem certeza que quer excluir este post?')) return;
  await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' });
  loadData();
}

document.addEventListener('DOMContentLoaded', loadData);