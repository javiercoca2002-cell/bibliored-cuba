document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const searchSpinner = document.getElementById('searchSpinner');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const favoritesLink = document.getElementById('favoritesLink');
  const favoritesModal = document.getElementById('favoritesModal');
  const closeModal = document.querySelectorAll('.close-modal');
  const favoritesList = document.getElementById('favoritesList');
  const themeToggle = document.getElementById('themeToggle');
  const main = document.querySelector('main');
  const noResultsMessage = document.getElementById('noResults');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let allUniversities = [];

  // Cargar datos de JSON y generar secciones
  fetch('universities.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar universities.json: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      console.log('Datos cargados:', data);
      allUniversities = data;
      renderSections(allUniversities);

      // Configurar observador para animaciones
      const allSections = document.querySelectorAll('.university-section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry);
          }
        });
      }, { threshold: 0.1 });

      allSections.forEach(section => observer.observe(section));

      // Configurar búsqueda
      let searchTimeout;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchSpinner.style.display = 'block';
        searchTimeout = setTimeout(() => {
          performSearch();
          searchSpinner.style.display = 'none';
        }, 500);
      });

      searchButton.addEventListener('click', () => {
        searchSpinner.style.display = 'block';
        performSearch();
        searchSpinner.style.display = 'none';
      });

      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchSpinner.style.display = 'block';
          performSearch();
          searchSpinner.style.display = 'none';
        }
        if (e.key === 'Escape') {
          searchInput.value = '';
          performSearch();
        }
      });
    })
    .catch(error => {
      console.error('Error:', error);
      main.innerHTML = '<p>Error al cargar los datos. Por favor, intenta de nuevo.</p>';
    });

  // Renderizar secciones
  function renderSections(universities) {
    main.innerHTML = '<p id="noResults" style="display: none;">No se encontraron resultados para tu búsqueda.</p>';
    universities.forEach(university => {
      const section = document.createElement('section');
      section.id = university.id;
      section.className = 'university-section';
      section.setAttribute('aria-labelledby', `${university.id}-title`);
      section.innerHTML = `
        <div class="university-header">
          <h2 class="university-title" id="${university.id}-title">${university.name}</h2>
          <span class="resource-count-badge">${university.resources.length} recursos</span>
        </div>
        <div class="resources-grid">
          ${university.resources.map(resource => `
            <div class="resource-card">
              <button class="favorite-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Añadir ${resource.title} a favoritos">☆</button>
              <span class="resource-type">${resource.type}</span>
              <a href="${resource.url}" class="resource-link" target="_blank">${resource.title}</a>
            </div>
          `).join('')}
        </div>
      `;
      main.appendChild(section);

      // Configurar botones de favoritos
      section.querySelectorAll('.favorite-btn').forEach(btn => {
        const url = btn.getAttribute('data-url');
        btn.addEventListener('click', () => toggleFavorite(btn, url));
        if (favorites.some(fav => fav.url === url)) {
          btn.textContent = '★';
          btn.classList.add('active');
          btn.setAttribute('aria-label', `Quitar ${btn.getAttribute('data-title')} de favoritos`);
        }
      });
    });
  }

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

  // Cerrar modales
  closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
      favoritesModal.style.display = 'none';
    });
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
      btn.setAttribute('aria-label', `Quitar ${title} de favoritos`);
    } else {
      favorites.splice(index, 1);
      btn.textContent = '☆';
      btn.classList.remove('active');
      btn.setAttribute('aria-label', `Añadir ${title} a favoritos`);
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
          <button class="remove-favorite" data-index="${index}" aria-label="Eliminar ${fav.title} de favoritos">×</button>
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
      btn.setAttribute('aria-label', `Añadir ${removedFavorite.title} a favoritos`);
    }

    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
  }

  // Función para realizar la búsqueda
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allSections = document.querySelectorAll('.university-section');
    noResultsMessage.style.display = 'none';

    if (searchTerm === '') {
      renderSections(allUniversities);
      return;
    }

    const flatResources = [];
    allUniversities.forEach(university => {
      university.resources.forEach(resource => {
        flatResources.push({
          universityId: university.id,
          universityName: university.name,
          type: resource.type,
          url: resource.url,
          title: resource.title
        });
      });
    });

    const fuse = new Fuse(flatResources, {
      keys: ['universityName', 'type', 'url', 'title'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true
    });

    const results = fuse.search(searchTerm);

    allSections.forEach(section => section.remove());

    if (results.length === 0) {
      noResultsMessage.style.display = 'block';
      return;
    }

    const groupedResults = {};
    results.forEach(result => {
      const { universityId, universityName, type, url, title, matches } = result.item;
      if (!groupedResults[universityId]) {
        groupedResults[universityId] = {
          name: universityName,
          resources: []
        };
      }
      groupedResults[universityId].resources.push({ type, url, title, matches });
    });

    Object.keys(groupedResults).forEach(universityId => {
      const university = groupedResults[universityId];
      const section = document.createElement('section');
      section.id = universityId;
      section.className = 'university-section visible';
      section.setAttribute('aria-labelledby', `${universityId}-title`);
      section.innerHTML = `
        <div class="university-header">
          <h2 class="university-title" id="${universityId}-title">${university.name}</h2>
          <span class="resource-count-badge">${university.resources.length} recursos</span>
        </div>
        <div class="resources-grid">
          ${university.resources.map(resource => {
            let highlightedTitle = resource.title;
            resource.matches.forEach(match => {
              if (match.key === 'title') {
                match.indices.forEach(([start, end]) => {
                  const term = resource.title.slice(start, end + 1);
                  highlightedTitle = highlightedTitle.replace(term, `<span class="highlight">${term}</span>`);
                });
              }
            });
            return `
              <div class="resource-card">
                <button class="favorite-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Añadir ${resource.title} a favoritos">☆</button>
                <span class="resource-type">${resource.type}</span>
                <a href="${resource.url}" class="resource-link" target="_blank">${highlightedTitle}</a>
              </div>
            `;
          }).join('')}
        </div>
      `;
      main.appendChild(section);

      section.querySelectorAll('.favorite-btn').forEach(btn => {
        const url = btn.getAttribute('data-url');
        btn.addEventListener('click', () => toggleFavorite(btn, url));
        if (favorites.some(fav => fav.url === url)) {
          btn.textContent = '★';
          btn.classList.add('active');
          btn.setAttribute('aria-label', `Quitar ${btn.getAttribute('data-title')} de favoritos`);
        }
      });
    });
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