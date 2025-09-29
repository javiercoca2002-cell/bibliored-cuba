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
  const paginationContainer = document.getElementById('pagination');
  const noResultsMessage = document.getElementById('noResults');

  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let allUniversities = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  // Cargar datos de JSON y generar secciones
  fetch('universities.json')
    .then(response => response.json())
    .then(data => {
      allUniversities = data;
      renderSections(allUniversities, currentPage);
      setupPagination(allUniversities);

      // Configurar observador para carga diferida
      const allSections = document.querySelectorAll('.university-section');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry);
          }
        });
      }, { threshold: 0.1 });

      allSections.forEach(section => {
        observer.observe(section);
      });

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

  // Función para renderizar secciones con paginación
  function renderSections(universities, page) {
    main.innerHTML = '<p id="noResults" style="display: none;">No se encontraron resultados para tu búsqueda.</p><div id="pagination" class="pagination"></div>';
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUniversities = universities.slice(start, end);

    paginatedUniversities.forEach(university => {
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
      main.insertBefore(section, paginationContainer);
      
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

    setupPagination(universities);
  }

  // Configurar paginación
  function setupPagination(universities) {
    const totalPages = Math.ceil(universities.length / itemsPerPage);
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderSections(universities, currentPage);
        window.scrollTo({ top: main.offsetTop, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.disabled = i === currentPage;
      button.addEventListener('click', () => {
        currentPage = i;
        renderSections(universities, currentPage);
        window.scrollTo({ top: main.offsetTop, behavior: 'smooth' });
      });
      paginationContainer.appendChild(button);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderSections(universities, currentPage);
        window.scrollTo({ top: main.offsetTop, behavior: 'smooth' });
      }
    });
    paginationContainer.appendChild(nextButton);
  }

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

  // Función para realizar la búsqueda optimizada con Fuse.js y resaltado
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allSections = document.querySelectorAll('.university-section');
    noResultsMessage.style.display = 'none';
    paginationContainer.style.display = 'none';

    if (searchTerm === '') {
      currentPage = 1;
      renderSections(allUniversities, currentPage);
      return;
    }

    // Crear una lista plana de recursos con sus universidades
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

    // Configurar Fuse.js
    const fuse = new Fuse(flatResources, {
      keys: ['universityName', 'type', 'url', 'title'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true
    });

    const results = fuse.search(searchTerm);

    // Limpiar secciones existentes
    allSections.forEach(section => section.remove());
    paginationContainer.innerHTML = '';

    // Mostrar mensaje de no resultados
    if (results.length === 0) {
      noResultsMessage.style.display = 'block';
      return;
    }

    // Agrupar resultados por universidad
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

    // Renderizar resultados agrupados
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
      main.insertBefore(section, paginationContainer);

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