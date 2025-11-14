document.addEventListener('DOMContentLoaded', async () => {
  const ctx = document.getElementById('engagementChart').getContext('2d');
  try {
    const res = await fetch('http://localhost:3000/posts');
    const posts = await res.json();

    const labels = posts.map(p => p.username);
    const likes = posts.map(p => p.likes);
    const retweets = posts.map(p => p.retweets);
    const comments = posts.map(p => p.comments.length);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'Likes', data: likes, backgroundColor: 'rgba(255,99,132,0.6)', borderColor: 'rgba(255,99,132,1)', borderWidth: 1 },
          { label: 'Retweets', data: retweets, backgroundColor: 'rgba(54,162,235,0.6)', borderColor: 'rgba(54,162,235,1)', borderWidth: 1 },
          { label: 'Comentários', data: comments, backgroundColor: 'rgba(75,192,192,0.6)', borderColor: 'rgba(75,192,192,1)', borderWidth: 1 }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { color: '#fff' } }, title: { display: true, text: 'Engajamento por Usuário', color: '#fff' } },
        scales: { y: { beginAtZero: true, ticks: { color: '#ccc' }, grid: { color: '#444' } }, x: { ticks: { color: '#ccc' }, grid: { color: '#444' } } }
      }
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
  }
});