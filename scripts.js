document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const favoritesLink = document.getElementById('favoritesLink');
  const favoritesModal = document.getElementById('favoritesModal');
  const closeModal = document.querySelector('.close-modal');
  const favoritesList = document.getElementById('favoritesList');
  const themeToggle = document.getElementById('themeToggle');
  const main = document.querySelector('main');

  // Cargar favoritos desde localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  // Cargar datos de JSON y generar secciones
  fetch('universities.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(university => {
        const section = document.createElement('section');
        section.id = university.id;
        section.className = 'university-section';
        section.innerHTML = `
          <div class="university-header">
            <h2 class="university-title">${university.name}</h2>
            <span class="resource-count-badge">${university.resources.length} recursos</span>
          </div>
          <div class="resources-grid">
            ${university.resources.map(resource => `
              <div class="resource-card">
                <button class="favorite-btn" data-url="${resource.url}" data-title="${resource.title}">☆</button>
                <span class="resource-type">${resource.type}</span>
                <a href="${resource.url}" class="resource-link" target="_blank">${resource.url}</a>
              </div>
            `).join('')}
          </div>
        `;
        main.appendChild(section);

        // Configurar botones de favoritos para esta sección
        section.querySelectorAll('.favorite-btn').forEach(btn => {
          const url = btn.getAttribute('data-url');
          btn.addEventListener('click', () => toggleFavorite(btn, url));

          // Marcar si ya es favorito
          if (favorites.some(fav => fav.url === url)) {
            btn.textContent = '★';
            btn.classList.add('active');
          }
        });
      });

      // Configurar observador para animaciones después de generar las secciones
      const allSections = document.querySelectorAll('.university-section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1 });

      allSections.forEach(section => {
        observer.observe(section);
      });

      // Ahora que las secciones existen, configurar búsqueda
      searchInput.addEventListener('input', performSearch);
      searchButton.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          performSearch();
        }
      });
    })
    .catch(error => console.error('Error al cargar universities.json:', error));

  // Configurar menú hamburguesa
  hamburger.addEventListener('click', function() {
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', 
      hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Abrir modal de favoritos
  favoritesLink.addEventListener('click', (e) => {
    e.preventDefault();
    showFavorites();
  });

  // Cerrar modal
  closeModal.addEventListener('click', () => {
    favoritesModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === favoritesModal) {
      favoritesModal.style.display = 'none';
    }
  });

  // Función para alternar favoritos
  function toggleFavorite(btn, url) {
    const title = btn.getAttribute('data-title');
    const index = favorites.findIndex(fav => fav.url === url);

    if (index === -1) {
      favorites.push({ url, title });
      btn.textContent = '★';
      btn.classList.add('active');
    } else {
      favorites.splice(index, 1);
      btn.textContent = '☆';
      btn.classList.remove('active');
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // Mostrar favoritos en el modal
  function showFavorites() {
    favoritesList.innerHTML = '';

    if (favorites.length === 0) {
      favoritesList.innerHTML = '<li>No tienes favoritos guardados</li>';
    } else {
      favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `
          <a href="${fav.url}" target="_blank">${fav.title}</a>
          <button class="remove-favorite" data-index="${index}">×</button>
        `;
        favoritesList.appendChild(li);
      });

      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = parseInt(e.target.getAttribute('data-index'));
          removeFavorite(index);
        });
      });
    }

    favoritesModal.style.display = 'block';
  }

  // Eliminar favorito
  function removeFavorite(index) {
    const removedFavorite = favorites[index];
    const btn = document.querySelector(`.favorite-btn[data-url="${removedFavorite.url}"]`);
    if (btn) {
      btn.textContent = '☆';
      btn.classList.remove('active');
    }

    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
  }

  // Función para realizar la búsqueda (adaptada para secciones dinámicas)
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allSections = document.querySelectorAll('.university-section');

    if (searchTerm === '') {
      allSections.forEach(section => {
        section.style.display = 'block';
      });
      document.querySelectorAll('.resource-card').forEach(card => {
        card.style.display = 'block';
      });
    } else {
      allSections.forEach(section => {
        const universityName = section.querySelector('.university-title').textContent.toLowerCase();
        const cards = section.querySelectorAll('.resource-card');
        let hasMatch = false;

        if (universityName.includes(searchTerm)) {
          hasMatch = true;
        }

        cards.forEach(card => {
          const link = card.querySelector('.resource-link');
          const linkText = link.textContent.toLowerCase();
          const linkType = card.querySelector('.resource-type').textContent.toLowerCase();

          if (linkText.includes(searchTerm) || linkType.includes(searchTerm)) {
            card.style.display = 'block';
            hasMatch = true;
          } else {
            card.style.display = 'none';
          }
        });

        section.style.display = hasMatch ? 'block' : 'none';
      });
    }
  }

  // Configurar cambio de tema
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌙' : '☀️';
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌙';
  } else {
    themeToggle.textContent = '☀️';
  }
});