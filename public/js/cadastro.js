const STORAGE_KEY = 'zwitter_perfil';
let usuario = JSON.parse(localStorage.getItem(STORAGE_KEY));
const form = document.getElementById('formUsuario');
const btnCancelar = document.getElementById('btnCancelar');
const linkPerfil = document.getElementById('linkPerfil');
const preview = document.getElementById('preview');
const fotoInput = document.getElementById('fotoInput');
const titulo = document.getElementById('titulo');

if (usuario) {
  document.getElementById('nome').value = usuario.nome || '';
  document.getElementById('arroba').value = usuario.arroba || '';
  document.getElementById('email').value = usuario.email || '';
  document.getElementById('email').classList.add('email-disabled');
  if (usuario.foto) preview.src = usuario.foto;
  titulo.textContent = 'Editar Perfil';
  btnCancelar.style.display = 'inline-block';
  linkPerfil.classList.remove('d-none');
} else {
  btnCancelar.style.display = 'none';
  linkPerfil.classList.add('d-none');
}

fotoInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = ev => preview.src = ev.target.result;
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', e => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const arroba = document.getElementById('arroba').value.trim();
  const email = usuario ? usuario.email : document.getElementById('email').value.trim();
  const foto = preview.src;
  if (!nome || !arroba || !email) {
    alert('Preencha todos os campos obrigatórios!');
    return;
  }
  usuario = {
    nome,
    arroba,
    email,
    foto,
    id: usuario ? usuario.id : email
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  alert('Perfil salvo com sucesso!');
  window.location.href = 'perfil.html';
});

btnCancelar.addEventListener('click', () => {
  window.location.href = 'perfil.html';
});