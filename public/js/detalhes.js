let postAtual = null;

function renderPost() {
  const container = document.getElementById('detalhes-container');
  if (!container || !postAtual) return;
  container.innerHTML = `
    <div class="post">
      <p class="mb-1"><strong>${postAtual.username}</strong> <span class="text-muted">${postAtual.handle} · ${postAtual.date}</span></p>
      <p>${postAtual.text}</p>
      ${postAtual.image ? `<img src="${postAtual.image}" class="img-fluid rounded mb-3" style="max-height:500px;object-fit:cover">` : ''}
    </div>
  `;
}

function renderComments() {
  const list = document.getElementById('comentarios-list');
  if (!list) return;
  if (!postAtual.comments || postAtual.comments.length === 0) {
    list.innerHTML = '<p class="text-muted">Nenhum comentário ainda.</p>';
    return;
  }
  list.innerHTML = postAtual.comments.map(c => `
    <div style="background:#0e0f11;border:1px solid #222;padding:12px;border-radius:10px;margin-bottom:10px">
      <strong>${c.username}</strong> <span style="opacity:.7">${c.handle}</span>
      <p style="margin:6px 0">${c.text}</p>
      <small style="color:#777">${c.date}</small>
    </div>
  `).join('');
}

async function loadDetails() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  if (!id) {
    document.getElementById('detalhes-container').innerHTML = '<p>Post inválido.</p>';
    return;
  }
  try {
    const res = await fetch(`http://localhost:3000/posts/${id}`);
    if (!res.ok) {
      document.getElementById('detalhes-container').innerHTML = '<p>Post não encontrado.</p>';
      return;
    }
    postAtual = await res.json();
    renderPost();
    renderComments();
  } catch {
    document.getElementById('detalhes-container').innerHTML = '<p>Erro ao carregar post.</p>';
  }
}

async function enviarComentario() {
  const txtEl = document.getElementById('comentario');
  if (!txtEl) return;
  const texto = txtEl.value.trim();
  if (!texto) return alert('Escreva um comentário');
  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');
  if (!perfil || !perfil.nome) return alert('Faça login para comentar');
  const novo = {
    username: perfil.nome,
    handle: perfil.arroba || '',
    text: texto,
    date: new Date().toISOString().slice(0,10)
  };
  postAtual.comments = Array.isArray(postAtual.comments) ? postAtual.comments : [];
  postAtual.comments.push(novo);
  try {
    const res = await fetch(`http://localhost:3000/posts/${postAtual.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postAtual)
    });
    if (!res.ok) return alert('Erro ao enviar comentário');
    txtEl.value = '';
    renderComments();
  } catch {
    alert('Erro de conexão ao enviar comentário');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDetails();
  const btn = document.getElementById('btn-comentar');
  if (btn) btn.addEventListener('click', enviarComentario);
  const ta = document.getElementById('comentario');
  if (ta) ta.addEventListener('keypress', (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) enviarComentario(); });
});
