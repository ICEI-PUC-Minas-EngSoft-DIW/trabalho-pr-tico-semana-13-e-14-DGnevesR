document.addEventListener('DOMContentLoaded', () => {
  const perfil = JSON.parse(localStorage.getItem('zwitter_perfil') || '{}');
  if (!perfil.id) {
    alert('Você precisa ter um perfil para postar!');
    location.href = 'cadastro.html';
    return;
  }
  const textarea = document.getElementById('postText');
  const fileInput = document.getElementById('postImage');
  const preview = document.getElementById('imagePreview');
  const btnPostar = document.getElementById('btnPostar');
  const charCount = document.getElementById('charCount');
  textarea.addEventListener('input', () => {
    const remaining = 280 - textarea.value.length;
    charCount.textContent = remaining;
    charCount.style.color = remaining < 0 ? '#f91880' : remaining < 50 ? '#f9c74f' : '#71767b';
    btnPostar.disabled = textarea.value.trim() === '' || remaining < 0;
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    preview.innerHTML = '';
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        preview.innerHTML = `<img src="${e.target.result}" alt="Prévia">`;
      };
      reader.readAsDataURL(file);
    }
  });
  btnPostar.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) return;
    const postBase = {
      userId: perfil.id,
      username: perfil.nome,
      handle: perfil.arroba,
      text: text,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      retweets: 0,
      comments: [],
      image: null
    };
    if (fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = async e => {
        postBase.image = e.target.result;
        await enviar(postBase);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      await enviar(postBase);
    }
  });
  async function enviar(post) {
    try {
      const res = await fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      if (res.ok) {
        textarea.value = '';
        fileInput.value = '';
        preview.innerHTML = '';
        charCount.textContent = '280';
        btnPostar.disabled = true;
        alert('Post publicado com sucesso!');
        location.href = 'index.html';
      } else {
        alert('Erro ao publicar o post');
      }
    } catch (err) {
      alert('Erro de conexão. Verifique se o json-server está rodando na porta 3000');
    }
  }
});