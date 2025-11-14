const STORAGE_KEY = 'zwitter_perfil';
const usuario = JSON.parse(localStorage.getItem(STORAGE_KEY));

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('perfil-container');
  if (!usuario) {
    container.innerHTML = `
      <div class="text-center p-5 bg-dark rounded shadow-lg">
        <h3 class="text-white mb-4">Nenhum perfil cadastrado</h3>
        <a href="cadastro.html" class="btn btn-primary btn-lg">Fazer Cadastro</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="perfil-card">
      <div class="avatar">
        <img src="img/perfil.jpg" alt="Foto de perfil">
      </div>
      <div class="info">
        <h2 class="nome">${usuario.nome}</h2>
        <p class="arroba">${usuario.arroba}</p>
        <p class="email">${usuario.email}</p>
        <div class="acoes">
          <a href="cadastro.html" class="btn btn-outline-primary">Editar Perfil</a>
          <a href="index.html" class="btn btn-outline-light ms-2">Voltar ao Início</a>
        </div>
      </div>
    </div>
  `;
});