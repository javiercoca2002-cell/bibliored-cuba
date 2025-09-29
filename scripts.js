document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const clearSearch = document.getElementById('clearSearch');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const favoritesLink = document.getElementById('favoritesLink');
  const helpLink = document.getElementById('helpLink');
  const favoritesModal = document.getElementById('favoritesModal');
  const tourConfirmModal = document.getElementById('tourConfirmModal');
  const closeModal = document.querySelectorAll('.close-modal');
  const favoritesList = document.getElementById('favoritesList');
  const themeToggle = document.getElementById('themeToggle');
  const main = document.querySelector('main');
  const startTourBtn = document.getElementById('startTourBtn');
  const skipTourBtn = document.getElementById('skipTourBtn');
  const tourOverlay = document.getElementById('tourOverlay');
  const tourTooltip = document.getElementById('tourTooltip');
  const noResultsMessage = document.getElementById('noResults');
  const spotlightSvg = document.getElementById('tourSpotlight');
  const spotlightCircle = document.getElementById('spotlightCircle');

  // Cargar favoritos desde localStorage
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let allUniversities = [];

  // Cargar datos de JSON y generar secciones
  fetch('universities.json')
    .then(response => response.json())
    .then(data => {
      allUniversities = data;

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

      // Configurar búsqueda
      searchInput.addEventListener('input', performSearch);
      searchButton.addEventListener('click', performSearch);
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          performSearch();
        }
      });

      // Configurar botón de borrar búsqueda
      searchInput.addEventListener('input', () => {
        clearSearch.style.display = searchInput.value ? 'block' : 'none';
      });

      clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        performSearch();
      });

      // Mostrar confirmación de tour al cargar la página si no se ha visto antes
      if (!sessionStorage.getItem('tourSeen')) {
        tourConfirmModal.style.display = 'block';
      }
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

  // Activar tour desde el menú de ayuda
  helpLink.addEventListener('click', (e) => {
    e.preventDefault();
    startTour();
  });

  // Cerrar modales
  closeModal.forEach(btn => {
    btn.addEventListener('click', () => {
      favoritesModal.style.display = 'none';
      tourConfirmModal.style.display = 'none';
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === favoritesModal) {
      favoritesModal.style.display = 'none';
    }
    if (event.target === tourConfirmModal) {
      tourConfirmModal.style.display = 'none';
    }
  });

  // Botones de confirmación del tour
  startTourBtn.addEventListener('click', () => {
    tourConfirmModal.style.display = 'none';
    startTour();
    sessionStorage.setItem('tourSeen', 'true');
  });

  skipTourBtn.addEventListener('click', () => {
    tourConfirmModal.style.display = 'none';
    sessionStorage.setItem('tourSeen', 'true');
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

  // Función para realizar la búsqueda optimizada con Fuse.js
  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const allSections = document.querySelectorAll('.university-section');
    noResultsMessage.style.display = 'none';

    if (searchTerm === '') {
      allSections.forEach(section => {
        section.style.display = 'block';
      });
      document.querySelectorAll('.resource-card').forEach(card => {
        card.style.display = 'block';
      });
      return;
    }

    // Crear una lista plana de recursos con sus universidades para búsqueda fuzzy
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

    // Configurar Fuse.js para búsqueda fuzzy
    const fuse = new Fuse(flatResources, {
      keys: ['universityName', 'type', 'url', 'title'],
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: true
    });

    const results = fuse.search(searchTerm);

    // Ocultar todas las secciones y tarjetas primero
    allSections.forEach(section => {
      section.style.display = 'none';
    });
    document.querySelectorAll('.resource-card').forEach(card => {
      card.style.display = 'none';
    });

    // Mostrar mensaje de no resultados si no hay coincidencias
    if (results.length === 0) {
      noResultsMessage.style.display = 'block';
      return;
    }

    // Mostrar coincidencias
    const matchedUniversityIds = new Set();
    results.forEach(result => {
      const { universityId, universityName } = result.item;
      const section = document.getElementById(universityId);
      if (section) {
        // Si el término coincide con el nombre de la universidad, mostrar todos sus recursos
        if (universityName.toLowerCase().includes(searchTerm)) {
          section.style.display = 'block';
          section.querySelectorAll('.resource-card').forEach(card => {
            card.style.display = 'block';
          });
        } else {
          // Mostrar solo los recursos específicos que coinciden
          section.style.display = 'block';
          section.querySelectorAll('.resource-card').forEach(card => {
            const cardUrl = card.querySelector('.resource-link').href;
            if (cardUrl === result.item.url) {
              card.style.display = 'block';
            }
          });
        }
        matchedUniversityIds.add(universityId);
      }
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

  // Lógica del tour interactivo
  const tourSteps = [
    {
      element: '.logo',
      description: 'Este es el logo de Bibliored Cuba. Haz clic para volver a la página principal.'
    },
    {
      element: '#themeToggle',
      description: 'Botón para cambiar entre modo oscuro y claro.'
    },
    {
      element: '.search-box',
      description: 'Barra de búsqueda: Escribe para buscar universidades o recursos.'
    },
    {
      element: '.university-section:first-child .university-header',
      description: 'Cabecera de universidad: Muestra el nombre y el número de recursos.'
    },
    {
      element: '.resource-card:first-child',
      description: 'Tarjeta de recurso: Contiene tipo, enlace y botón de favorito.'
    },
    {
      element: '#favoritesLink',
      description: 'Enlace a favoritos: Abre el modal con tus recursos guardados.'
    }
  ];

  let currentStep = 0;

  function startTour() {
    tourOverlay.style.display = 'block';
    showStep(currentStep);
  }

  function showStep(step) {
    if (step >= tourSteps.length) {
      endTour();
      return;
    }

    const { element, description } = tourSteps[step];
    const target = document.querySelector(element);

    if (target) {
      const rect = target.getBoundingClientRect();
      tourTooltip.style.display = 'block';
      tourTooltip.innerHTML = `
        <p>${description}</p>
        <button id="nextTourBtn">Siguiente</button>
      `;

      // Ajustar posición del círculo SVG
      const circleRadius = Math.max(rect.width, rect.height) / 2 + 20; // Añadir margen
      spotlightCircle.setAttribute('cx', rect.left + rect.width / 2);
      spotlightCircle.setAttribute('cy', rect.top + rect.height / 2);
      spotlightCircle.setAttribute('r', circleRadius);
      spotlightSvg.style.display = 'block';

      // Ajustar posición vertical del tooltip
      let topPosition = rect.bottom + 10;
      if (topPosition + tourTooltip.offsetHeight > window.innerHeight) {
        topPosition = rect.top - tourTooltip.offsetHeight - 10;
      }
      tourTooltip.style.top = `${topPosition}px`;

      // Ajustar posición horizontal para que no se salga del viewport
      let leftPosition = rect.left + (rect.width / 2) - (tourTooltip.offsetWidth / 2);
      const tooltipWidth = tourTooltip.offsetWidth;
      const viewportWidth = window.innerWidth;
      if (leftPosition < 10) {
        leftPosition = 10;
      } else if (leftPosition + tooltipWidth > viewportWidth - 10) {
        leftPosition = viewportWidth - tooltipWidth - 10;
      }
      tourTooltip.style.left = `${leftPosition}px`;

      document.getElementById('nextTourBtn').addEventListener('click', nextStep);
    } else {
      nextStep();
    }
  }

  function nextStep() {
    spotlightSvg.style.display = 'none';
    tourTooltip.style.display = 'none';
    currentStep++;
    showStep(currentStep);
  }

  function endTour() {
    tourOverlay.style.display = 'none';
    tourTooltip.style.display = 'none';
    spotlightSvg.style.display = 'none';
    currentStep = 0;
  }

  tourOverlay.addEventListener('click', endTour);
});