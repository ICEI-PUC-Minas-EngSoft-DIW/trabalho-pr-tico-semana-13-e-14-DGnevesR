async function loadFavorites() {
  const container = document.getElementById('favoritos-container');

  let favs = JSON.parse(localStorage.getItem("zwitter_favoritos") || "[]");
  favs = favs.map(n => Number(n));

  const res = await fetch("http://localhost:3000/posts");
  const posts = await res.json();

  const favoritos = posts.filter(p => favs.includes(Number(p.id)));

  if (favoritos.length === 0) {
    container.innerHTML = "<p>Nenhum post favoritado ainda 💔</p>";
    return;
  }

  container.innerHTML = favoritos.map(p => `
    <div class="fav-post">
      <h4>${p.username} <span style="opacity:.7">${p.handle}</span></h4>
      <p>${p.text}</p>
      ${p.image ? `<img src="${p.image}">` : ""}
      <button data-post-id="${p.id}" class="favorite-btn active" onclick="toggleFavorite(${p.id})">♥</button>
      <a href="detalhes.html?id=${p.id}" class="highlight-button">Ver detalhes</a>
    </div>
  `).join('');
}

document.addEventListener("DOMContentLoaded", loadFavorites);
