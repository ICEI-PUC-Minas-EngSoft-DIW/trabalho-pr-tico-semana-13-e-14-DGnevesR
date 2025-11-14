const STORAGE_KEY = 'zwitter_perfil';
let usuario = JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
const form = document.getElementById('formUsuario');
const btnCancelar = document.getElementById('btnCancelar');
const linkPerfil = document.getElementById('linkPerfil');

function salvarUsuario() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
}

if (usuario) {
  document.getElementById('nome').value = usuario.nome;
  document.getElementById('arroba').value = usuario.arroba;
  document.getElementById('email').value = usuario.email;
  btnCancelar.style.display = 'inline-block';
  linkPerfil.style.display = 'none';
} else {
  btnCancelar.style.display = 'none';
  linkPerfil.style.display = 'inline-block';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const arroba = document.getElementById('arroba').value.trim();
  const email = document.getElementById('email').value.trim();
  if (!nome || !arroba || !email) {
    alert('Preencha todos os campos!');
    return;
  }
  usuario = { nome, arroba, email };
  salvarUsuario();
  window.location.href = 'perfil.html';
});

btnCancelar.addEventListener('click', () => {
  window.location.href = 'perfil.html';
});