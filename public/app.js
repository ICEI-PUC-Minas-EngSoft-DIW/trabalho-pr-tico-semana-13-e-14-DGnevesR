const posts = [
    {
        id: 1,
        username: "user.maneiro",
        handle: "@user.bolado",
        text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
        image: "img/sol.jpg",
        date: "2025-10-01",
        likes: 120,
        retweets: 45,
        comments: [
            {
                username: "ana_aninha",
                handle: "@Ana_Aninha_Anão",
                text: "Cê tá bem mano ?",
                date: "2025-10-01"
            },
            {
                username: "frio_gelado",
                handle: "@Frio_Gelado",
                text: "Foto mídia",
                date: "2025-10-01"
            }
        ]
    },
    {
        id: 2,
        username: "yoga_lover",
        handle: "@yoga_peace",
        text: "Enjoying a peaceful yoga session this morning!",
        image: "img/yoga.jpg",
        date: "2025-10-02",
        likes: 85,
        retweets: 30,
        comments: [
            {
                username: "boca_085",
                handle: "@Boca_085",
                text: "Tenho nem osso pra isso",
                date: "2025-10-02"
            }
        ]
    },
    {
        id: 3,
        username: "nature_explorer",
        handle: "@wild_adventures",
        text: "Text of the printing and typesetting industry lorem Ipsum is simply dummy Took a galley to make a type when an unknown printer specimen book.",
        image: "img/aguia.jpg",
        date: "2025-10-03",
        likes: 200,
        retweets: 60,
        comments: [
            {
                username: "flakes_power",
                handle: "@Flakes_Power",
                text: "Parece até IA KAAKAKKAKAAKAKA",
                date: "2025-10-03"
            },
            {
                username: "nobru_oapelao",
                handle: "@Nobru_OApelão",
                text: "Cócóóóóóóóóó",
                date: "2025-10-03"
            }
        ]
    }
];

function renderPosts() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const feed = document.querySelector('.feed');
        if (!feed) return;
        feed.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <p><strong>${post.username}</strong> ${post.handle} · ${post.date}</p>
                <p>${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="Imagem do post">` : ''}
                <p>❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}</p>
                <a href="detalhes.html?id=${post.id}" class="highlight-button">Ver detalhes</a>
            `;
            feed.appendChild(postElement);
        });
    }
}

function renderCarousel() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const carouselInner = document.querySelector('#highlightCarousel .carousel-inner');
        const carouselIndicators = document.querySelector('#highlightCarousel .carousel-indicators');
        if (!carouselInner || !carouselIndicators) return;
        carouselInner.innerHTML = '';
        carouselIndicators.innerHTML = '';
        posts.forEach((post, index) => {
            const isActive = index === 0 ? 'active' : '';
            const indicator = `
                <button type="button" data-bs-target="#highlightCarousel" data-bs-slide-to="${index}" class="${isActive}" aria-label="Slide ${index + 1}"></button>
            `;
            const item = `
                <div class="carousel-item ${isActive}">
                    <img src="${post.image}" class="d-block w-100" alt="${post.username}">
                    <div class="carousel-caption d-block">
                        <h5>${post.username}</h5>
                        <p>${post.text.substring(0, 100)}${post.text.length > 100 ? '...' : ''}</p>
                        <a href="detalhes.html?id=${post.id}" class="highlight-button">Ver mais</a>
                    </div>
                </div>
            `;
            carouselIndicators.innerHTML += indicator;
            carouselInner.innerHTML += item;
        });
    }
}

function renderPostDetails() {
    if (window.location.pathname.includes('detalhes.html')) {
        const postDetails = document.getElementById('post-details');
        const linkedPhotos = document.getElementById('linked-photos');
        const commentsSection = document.getElementById('comments-section');
        if (!postDetails || !linkedPhotos || !commentsSection) return;
        
        const urlParams = new URLSearchParams(window.location.search);
        const postId = parseInt(urlParams.get('id'), 10);
        const post = posts.find(p => p.id === postId);

        if (post) {
            postDetails.innerHTML = `
                <p><strong>Usuário:</strong> ${post.username} (${post.handle})</p>
                <p><strong>Data:</strong> ${post.date}</p>
                <p><strong>Texto:</strong> ${post.text}</p>
                ${post.image ? `<img src="${post.image}" alt="Imagem do post">` : ''}
                <p><strong>Engajamento:</strong> ❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}</p>
            `;
            
            linkedPhotos.innerHTML = post.image ? `
                <div class="photo-card">
                    <img src="${post.image}" alt="Foto vinculada">
                    <h5>Foto de ${post.username}</h5>
                </div>
            ` : '<p>Sem fotos vinculadas.</p>';

            commentsSection.innerHTML = post.comments.length > 0 ? post.comments.map(comment => `
                <div class="comment">
                    <p><strong>${comment.username}</strong> ${comment.handle} · ${comment.date}</p>
                    <p>${comment.text}</p>
                </div>
            `).join('') : '<p>Sem comentários ainda.</p>';

            const commentInput = document.getElementById('novo-comentario');
            const commentButton = document.getElementById('enviar-comentario');
            if (commentButton && commentInput) {
                commentButton.onclick = () => {
                    const commentText = commentInput.value.trim();
                    if (commentText) {
                        post.comments.push({
                            username: "user.maneiro",
                            handle: "@user.bolado",
                            text: commentText,
                            date: new Date().toISOString().split('T')[0]
                        });
                        commentsSection.innerHTML = post.comments.map(comment => `
                            <div class="comment">
                                <p><strong>${comment.username}</strong> ${comment.handle} · ${comment.date}</p>
                                <p>${comment.text}</p>
                            </div>
                        `).join('');
                        postDetails.querySelector('p:last-child').innerHTML = `
                            <strong>Engajamento:</strong> ❤️ ${post.likes} 🔄 ${post.retweets} 💬 ${post.comments.length}
                        `;
                        commentInput.value = '';
                    }
                };
            }
        } else {
            postDetails.innerHTML = '<p>Post não encontrado.</p>';
            linkedPhotos.innerHTML = '';
            commentsSection.innerHTML = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderPosts();
    renderCarousel();
    renderPostDetails();
});