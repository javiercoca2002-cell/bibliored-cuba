// ===== ESPÍA DE ERRORES (Para detectar fallos de sintaxis) =====
window.addEventListener('error', function(e) {
  document.body.innerHTML = `
    <div style="padding:20px; background:#ff0000; color:#ffffff; font-family:monospace; font-size:16px; z-index:99999; position:fixed; top:0; left:0; width:100%; height:100%; overflow:auto;">
      <h2>❌ ERROR DETECTADO EN EL SCRIPT</h2>
      <p><b>Mensaje:</b> ${e.message}</p>
      <p><b>Archivo:</b> ${e.filename}</p>
      <p><b>Línea:</b> ${e.lineno}</p>
    </div>
  `;
});

document.addEventListener('DOMContentLoaded', async function() {
  // ========== ELEMENTOS DEL DOM ==========
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const filterToggleBtn = document.getElementById('filterToggleBtn');
  const filterContainer = document.getElementById('filterContainer');

  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const favoritesLink = document.getElementById('favoritesLink');
  const favoritesModal = document.getElementById('favoritesModal');
  const closeModal = document.querySelectorAll('.close-modal');
  const favoritesList = document.getElementById('favoritesList');
  const themeToggle = document.getElementById('themeToggle');
  const universitiesListView = document.getElementById('universitiesListView');
  const universityDetailView = document.getElementById('universityDetailView');
  const universitiesListContainer = document.getElementById('universitiesListContainer');
  const universityDetailContainer = document.getElementById('universityDetailContainer');
  const backToListBtn = document.getElementById('backToListBtn');
  const noResultsMessage = document.getElementById('noResults');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // ========== ICONOS SVG ==========
  const SVG_COPY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const SVG_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  const SVG_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const SVG_SHARE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';

  // ========== NUEVOS ELEMENTOS DEL DOM ==========
  const historyLink = document.getElementById('historyLink');
  const customLinksLink = document.getElementById('customLinksLink');
  const clearCacheLink = document.getElementById('clearCacheLink');
  const aboutLink = document.getElementById('aboutLink');
  const feedbackLink = document.getElementById('feedbackLink');

  const historyModal = document.getElementById('historyModal');
  const customLinksModal = document.getElementById('customLinksModal');
  const aboutModal = document.getElementById('aboutModal');

  const historyList = document.getElementById('historyList');
  const customLinksList = document.getElementById('customLinksList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const saveNewLinkBtn = document.getElementById('saveNewLinkBtn');
  const newLinkTitle = document.getElementById('newLinkTitle');
  const newLinkUrl = document.getElementById('newLinkUrl');

  // ===== Elementos del Modal de Confirmación =====
  const confirmModal = document.getElementById('confirmModal');
  const confirmModalTitle = document.getElementById('confirmModalTitle');
  const confirmModalMessage = document.getElementById('confirmModalMessage');
  const confirmModalAcceptBtn = document.getElementById('confirmModalAcceptBtn');
  const confirmModalCancelBtn = document.getElementById('confirmModalCancelBtn');

  // ===== Elementos del Modal de Valoración =====
  const ratingModal = document.getElementById('ratingModal');
  const ratingEmailBtn = document.getElementById('ratingEmailBtn');
  const ratingApklisBtn = document.getElementById('ratingApklisBtn');

  // ========== ELEMENTOS DE FILTRO ==========
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ========== VARIABLES GLOBALES ==========
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let currentUniversity = null;
  let isSearchMode = false;
  let visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
  let customLinks = JSON.parse(localStorage.getItem('customLinks')) || [];
  let currentFilter = 'all';

  let universitiesData = []; // Se llenará con el fetch

  // ===== TOGGLE DE FILTROS =====
  const FILTERS_STORAGE_KEY = 'filtersOpen';

  function updateFilterToggleUI(isOpen) {
    if (!filterToggleBtn || !filterContainer) return;

    const textEl = filterToggleBtn.querySelector('.filter-toggle-text');

    if (isOpen) {
      filterContainer.classList.add('open');
      filterToggleBtn.setAttribute('aria-expanded', 'true');
      if (textEl) textEl.textContent = 'Ocultar filtros';
    } else {
      filterContainer.classList.remove('open');
      filterToggleBtn.setAttribute('aria-expanded', 'false');
      if (textEl) textEl.textContent = 'Mostrar filtros';
    }
  }

  // ========== CARGAR DATOS DESDE JSON EXTERNO ==========
  try {
    // Añadimos ?v= para forzar la recarga y evitar la caché vieja
    const response = await fetch('./universities.json?v=' + new Date().getTime());
    if (!response.ok) throw new Error('Error HTTP: ' + response.status);
    universitiesData = await response.json();
  } catch (error) {
    console.error("Error crítico cargando JSON:", error);
    // Alerta visible para saber si el fetch falla
    alert('❌ ERROR AL CARGAR EL JSON: ' + error.message + '\n\nRevisa la consola para más detalles.');
    universitiesListContainer.innerHTML = '<p style="text-align:center; color:red; padding:20px;">Error al cargar los datos de las universidades. Verifica tu conexión o recarga la página.</p>';
    return;
  }

  // ===== Función genérica de confirmación =====
  function showConfirm(title, message, onAccept) {
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmModal.style.display = 'block';

    const newAcceptBtn = confirmModalAcceptBtn.cloneNode(true);
    const newCancelBtn = confirmModalCancelBtn.cloneNode(true);
    confirmModalAcceptBtn.parentNode.replaceChild(newAcceptBtn, confirmModalAcceptBtn);
    confirmModalCancelBtn.parentNode.replaceChild(newCancelBtn, confirmModalCancelBtn);

    newAcceptBtn.addEventListener('click', () => {
      confirmModal.style.display = 'none';
      if (onAccept) onAccept();
    });

    newCancelBtn.addEventListener('click', () => {
      confirmModal.style.display = 'none';
    });
  }

  // ========== ALIAS DE UNIVERSIDADES ==========
  const universityAliases = {
    'upr': ['upr', 'pinar del río', 'pinareño', 'hermanos saíz', 'universidad de pinar del río'],
    'ua': ['ua', 'artemisa', 'artemiseño', 'universidad de artemisa'],
    'uh': ['uh', 'la habana', 'habanero', 'colina universitaria', 'universidad de la habana'],
    'uci': ['uci', 'ciencias informáticas', 'informática', 'universidad de las ciencias informáticas'],
    'cujae': ['cujae', 'tecnológica de la habana', 'echeverría', 'universidad tecnológica de la habana'],
    'um': ['um', 'matanzas', 'matancero', 'camilo cienfuegos', 'universidad de matanzas'],
    'ucf': ['ucf', 'cienfuegos', 'cienfueguero', 'carlos rafael rodríguez', 'universidad de cienfuegos'],
    'uclv': ['uclv', 'las villas', 'villaclareño', 'marta abreu', 'universidad central', 'universidad de las villas', 'universidad central de las villas'],
    'uniss': ['uniss', 'sancti spíritus', 'sancti spiritus', 'espirituano', 'josé martí', 'jose marti', 'universidad de sancti spíritus', 'universidad de sancti spiritus'],
    'unica': ['unica', 'ciego de ávila', 'ciego de avila', 'avileño', 'máximo gómez', 'maximo gomez', 'universidad de ciego de ávila'],
    'uc': ['uc', 'camagüey', 'camaguey', 'camagüeyano', 'ignacio agramonte', 'universidad de camagüey'],
    'ult': ['ult', 'las tunas', 'tunero', 'vladimir ilich lenin', 'universidad de las tunas'],
    'uho': ['uho', 'holguín', 'holguin', 'holguinero', 'oscar lucero', 'universidad de holguín'],
    'umoa': ['umoa', 'moa', 'antonio núñez', 'antonio nuñez', 'universidad de moa'],
    'udg': ['udg', 'granma', 'granmense', 'blas roca', 'universidad de granma'],
    'uo': ['uo', 'oriente', 'santiago de cuba', 'santiaguero', 'mella', 'universidad de oriente'],
    'ug': ['ug', 'guantánamo', 'guantanamo', 'guantanamero', 'cug', 'universidad de guantánamo'],
    'uij': ['uij', 'isla de la juventud', 'pinos', 'universidad de la isla de la juventud'],
    'unah': ['unah', 'universidad de las artes', 'artes', 'isa', 'instituto superior de arte'],
    'ucpejv': ['ucpejv', 'enrique josé varona', 'enrique jose varona', 'varona', 'pedagógica', 'pedagogica', 'ciencias pedagógicas'],
    'uccfd': ['uccfd', 'manuel fajardo', 'fajardo', 'cultura física', 'cultura fisica', 'deporte', 'ciencias de la cultura física']
  };

  // ===== TIPOS DE RECURSOS QUE NUNCA DEBEN RECIBIR TAG "tesis" =====
  const TIPOS_PROHIBIDOS_PARA_TESIS = [
    'sigenu', 'eventos', 'chat', 'correo', 'nube', 'vpn',
    'videoconferencia', 'encuestas', 'intranet', 'observatorio',
    'evea', 'moodle', 'revista', 'biblioteca', 'ftp', 'software',
    'aplicaciones', 'código', 'gitlab', 'webmail', 'email'
  ];

  // ========== ENRIQUECER RECURSOS CON TAGS ==========
  function enrichResourceWithTags(resource, universityId, universityName) {
    const tags = [];

    if (resource.searchTags) {
      const manualTags = resource.searchTags.toLowerCase().split(/\s+/);
      tags.push(...manualTags);
    }

    const resourceTypeLower = resource.type.toLowerCase();
    const resourceTitleLower = resource.title.toLowerCase();

    tags.push(resourceTypeLower);
    tags.push(resourceTitleLower);

    const titleWords = resource.title.toLowerCase()
      .replace(/[()\-.,:;\/]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    tags.push(...titleWords);

    if (resourceTypeLower.includes('evea') || resourceTitleLower.includes('moodle')) {
      tags.push('moodle', 'aula-virtual', 'cursos');
    }

    if (resourceTypeLower.includes('correo')) {
      tags.push('correo', 'email', 'webmail');
      if (resourceTitleLower.includes('estudiante')) tags.push('estudiantes');
      if (resourceTitleLower.includes('profesor')) tags.push('profesores');
    }

    if (resourceTypeLower.includes('revista')) {
      tags.push('revista', 'articulo', 'publicacion', 'pdf');
    }

    if (resourceTypeLower.includes('sigenu')) {
      tags.push('sigenu', 'notas', 'calificaciones', 'expediente', 'secretaria');
    }

    if (resourceTypeLower.includes('eventos')) {
      tags.push('eventos', 'congreso', 'ponencia');
    }

    if (resourceTypeLower.includes('nube')) {
      tags.push('nube', 'almacenamiento', 'drive');
    }

    if (resourceTypeLower.includes('observatorio')) {
      tags.push('observatorio', 'indicadores', 'metricas');
    }

    if (resourceTypeLower.includes('biblioteca')) {
      tags.push('biblioteca', 'libros', 'catalogo');
    }

    if (resourceTypeLower.includes('vpn')) {
      tags.push('vpn', 'acceso-remoto');
    }

    if (resourceTypeLower.includes('videoconferencia')) {
      tags.push('videoconferencia', 'jitsi', 'reunion');
    }

    if (universityAliases[universityId]) {
      const normalizedAliases = universityAliases[universityId].map(a =>
        a.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      );
      tags.push(...normalizedAliases);
    }

    tags.push(universityId);
    tags.push(universityName.toLowerCase());

    return {
      ...resource,
      searchTags: [...new Set(tags)].join(' ')
    };
  }

  // Procesar los datos descargados del JSON
  universitiesData.forEach(university => {
    university.resources = university.resources.map(resource =>
      enrichResourceWithTags(resource, university.id, university.name)
    );
  });

  // ========== TEMA POR DEFECTO: CLARO ==========
  const savedTheme = localStorage.getItem('theme');
  const initialIsLight = savedTheme !== 'dark';

  if (savedTheme === 'dark') {
    themeToggle.innerHTML = '<svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>';
  } else {
    document.body.classList.add('light-mode');
    themeToggle.innerHTML = '<svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>';
    localStorage.setItem('theme', 'light');
  }

  // ========== RENDERIZAR LISTA DE UNIVERSIDADES ==========
  function renderUniversitiesList() {
    isSearchMode = false;
    universitiesListContainer.innerHTML = '';

    universitiesData.forEach(university => {
      const card = document.createElement('div');
      card.className = 'university-card';
      card.innerHTML = `
        ${university.logo ? `<img src="${university.logo}" alt="Logo de ${university.name}" class="university-logo" loading="lazy">` : ''}
        <h3>${university.name}</h3>
        <span class="resource-badge">${university.resources.length} recursos</span>
        <button class="view-university-btn" data-university-id="${university.id}">Ver universidad →</button>
      `;
      universitiesListContainer.appendChild(card);
    });

    document.querySelectorAll('.view-university-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const universityId = e.target.getAttribute('data-university-id');
        showUniversityDetail(universityId);
      });
    });
  }

  // ========== MOSTRAR DETALLE DE UNIVERSIDAD ==========
  function showUniversityDetail(universityId) {
    const university = universitiesData.find(u => u.id === universityId);
    if (!university) return;

    currentUniversity = university;
    universitiesListView.style.display = 'none';
    universityDetailView.style.display = 'block';
    noResultsMessage.style.display = 'none';

    universityDetailContainer.innerHTML = `
      <div class="detail-header">
        ${university.logo ? `<img src="${university.logo}" alt="Logo de ${university.name}" class="university-logo">` : ''}
        <h2>${university.name}</h2>
        <span class="detail-resource-count">${university.resources.length} recursos</span>
      </div>
      <div class="resources-grid">
        ${university.resources.map(resource => `
          <div class="resource-card">
            <div class="resource-card-actions">
              <button class="favorite-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Añadir a favoritos">☆</button>
              <button class="copy-link-btn" data-url="${resource.url}" aria-label="Copiar enlace">${SVG_COPY}</button>
              <button class="share-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Compartir enlace">${SVG_SHARE}</button>
            </div>
            <span class="resource-type">${resource.type}</span>
            <span class="resource-title">${resource.title}</span>
            <a href="${resource.url}" class="resource-link" target="_blank" rel="noopener noreferrer">${resource.url}</a>
          </div>
        `).join('')}
      </div>
    `;

    universityDetailContainer.querySelectorAll('.favorite-btn').forEach(btn => {
      const url = btn.getAttribute('data-url');
      btn.addEventListener('click', () => toggleFavorite(btn, url));
      if (favorites.some(fav => fav.url === url)) {
        btn.textContent = '★';
        btn.classList.add('active');
      }
    });

    universityDetailContainer.querySelectorAll('.copy-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-url');
        copyToClipboard(url);
        btn.innerHTML = SVG_CHECK;
        setTimeout(() => { btn.innerHTML = SVG_COPY; }, 1500);
      });
    });

    universityDetailContainer.querySelectorAll('.share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-url');
        const title = btn.getAttribute('data-title');
        shareResource(url, title);
      });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    updateFilterToggleUI(false);
  }

  // ========== VOLVER A LA LISTA ==========
  function backToList() {
    if (isSearchMode) renderUniversitiesList();
    universitiesListView.style.display = 'block';
    universityDetailView.style.display = 'none';
    currentUniversity = null;
    isSearchMode = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const savedState = localStorage.getItem(FILTERS_STORAGE_KEY) === 'true';
    updateFilterToggleUI(savedState);
  }

  // ========== FUNCIONES DE FILTRADO ==========
  function filterResourcesByType(resources, filterType) {
    if (filterType === 'all') return resources;

    return resources.filter(resource => {
      const searchTags = (resource.searchTags || '').toLowerCase();
      const type = resource.type.toLowerCase();
      const title = resource.title.toLowerCase();

      switch (filterType) {
        case 'tesis':
          return searchTags.includes('tesis');
        case 'revista':
          return type.includes('revista') || searchTags.includes('revista');
        case 'moodle':
          return type.includes('evea') || searchTags.includes('moodle') || title.includes('moodle');
        case 'correo':
          return type.includes('correo') || searchTags.includes('correo') || searchTags.includes('email');
        case 'sigenu':
          return type.includes('sigenu') || searchTags.includes('sigenu') || title.includes('notas');
        case 'eventos':
          return type.includes('eventos') || searchTags.includes('eventos') || searchTags.includes('congreso');
        default:
          return true;
      }
    });
  }

  function setActiveFilter(filterType) {
    currentFilter = filterType;
    filterButtons.forEach(btn => {
      const btnFilter = btn.getAttribute('data-filter');
      if (btnFilter === filterType) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    performSearch();
  }

  // ========== BÚSQUEDA HÍBRIDA ==========
  const normalizeText = (text) => {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  };

  let fuseInstance = null;
  let flatResourcesCache = [];

  function buildSearchCache() {
    flatResourcesCache = [];
    universitiesData.forEach(university => {
      university.resources.forEach(resource => {
        flatResourcesCache.push({
          universityId: university.id,
          universityName: university.name,
          universityLogo: university.logo,
          resource: resource,
          searchText: `${resource.type} ${resource.title} ${resource.searchTags || ''} ${university.name} ${universityAliases[university.id]?.join(' ') || ''}`
        });
      });
    });

    fuseInstance = new Fuse(flatResourcesCache, {
      keys: ['searchText'],
      threshold: 0.2,
      ignoreLocation: true,
      includeScore: true,
      findAllMatches: false,
      minMatchCharLength: 4
    });
  }

  buildSearchCache();

  // ========== MINI IA SABERCUBA ==========
  const SEARCH_PATTERNS = {
    'tesis': {
        keywords: ['tesis', 'trabajo diploma', 'investigacion', 'doctoral', 'maestria', 'pregrado'],
        targetTypes: ['Repositorio Institucional', 'Repositorio - Tesis'],
        weight: 25
    },
    'correo': {
        keywords: ['correo', 'email', 'webmail', 'buzon', 'bandeja', 'mensajes', 'zimbra', 'roundcube'],
        targetTypes: ['Correo electrónico'],
        weight: 30
    },
    'aula_virtual': {
        keywords: ['moodle', 'evea', 'aula virtual', 'plataforma', 'cursos', 'ead', 'mooc', 'clases'],
        targetTypes: ['EVEA Pregrado', 'EVEA Posgrado', 'EVEA EaD', 'EVEA MOOCs'],
        weight: 28
    },
    'revistas': {
        keywords: ['revista', 'articulo', 'publicacion', 'paper', 'journal', 'cientifica'],
        targetTypes: ['Revista Científica'],
        weight: 22
    },
    'biblioteca': {
        keywords: ['biblioteca', 'catalogo', 'libros', 'consulta'],
        targetTypes: ['Sitio Web Biblioteca', 'Repositorio de Libros'],
        weight: 20
    },
    'repositorio': {
        keywords: ['repositorio', 'dspace', 'archivos', 'digital', 'acceso abierto'],
        targetTypes: ['Repositorio Institucional', 'Repositorio - Tesis'],
        weight: 22
    },
    'sigenu': {
        keywords: ['sigenu', 'notas', 'calificaciones', 'expediente', 'matricula', 'secretaria'],
        targetTypes: ['SIGENU'],
        weight: 25
    },
    'eventos': {
        keywords: ['eventos', 'congreso', 'conferencia', 'taller', 'simposio', 'jornada'],
        targetTypes: ['Sitio Web Eventos'],
        weight: 20
    },
    'nube': {
        keywords: ['nube', 'almacenamiento', 'drive', 'nextcloud', 'compartir'],
        targetTypes: ['Nube'],
        weight: 18
    }
  };

  const AREA_SYNONYMS = {
    'informatica': ['informática', 'computacion', 'software', 'programacion', 'sistemas', 'ingenieria informatica', 'ciencias informaticas'],
    'medicina': ['medicina', 'salud', 'enfermeria', 'ciencias medicas'],
    'ingenieria': ['ingeniería', 'ingenieria civil', 'ingenieria industrial', 'ingenieria mecanica', 'ingenieria electrica', 'ingenieria hidraulica', 'ingenieria quimica'],
    'pedagogia': ['pedagogía', 'educacion', 'docencia', 'ensenanza', 'maestro', 'profesor', 'didactica'],
    'economia': ['economía', 'contabilidad', 'finanzas', 'administracion', 'gestion', 'turismo'],
    'derecho': ['derecho', 'leyes', 'juridico', 'abogacia'],
    'agricultura': ['agricultura', 'agronomia', 'agropecuaria', 'forestal', 'cultivos'],
    'deporte': ['deporte', 'cultura fisica', 'entrenamiento', 'recreacion'],
    'arte': ['arte', 'literatura', 'musica', 'diseño', 'cultura'],
    'quimica': ['química', 'farmacia', 'biotecnologia', 'bioquimica'],
    'geologia': ['geología', 'mineria', 'metalurgia', 'geofisica'],
    'sociales': ['sociologia', 'filosofia', 'historia', 'psicologia', 'comunicacion', 'humanidades']
  };

  const COMMON_PHRASES = {
    'quiero ver mis notas': { intent: 'sigenu', weight: 40 },
    'donde estan las calificaciones': { intent: 'sigenu', weight: 40 },
    'mi expediente academico': { intent: 'sigenu', weight: 40 },
    'quiero entrar a mi correo': { intent: 'correo', weight: 40 },
    'correo de estudiantes': { intent: 'correo', weight: 35 },
    'plataforma de clases': { intent: 'aula_virtual', weight: 35 },
    'cursos en linea': { intent: 'aula_virtual', weight: 35 },
    'buscar libros': { intent: 'biblioteca', weight: 30 },
    'consultar biblioteca': { intent: 'biblioteca', weight: 30 },
    'trabajo de diploma': { intent: 'tesis', weight: 35 },
    'tesis de grado': { intent: 'tesis', weight: 35 },
    'articulos cientificos': { intent: 'revistas', weight: 35 },
    'proximos eventos': { intent: 'eventos', weight: 30 },
    'guardar archivos': { intent: 'nube', weight: 25 }
  };

  // ===== CORRECCIÓN ORTOGRÁFICA =====
  function levenshteinDistance(a, b) {
    if (Math.abs(a.length - b.length) > 3) return 999;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i-1) === a.charAt(j-1)) matrix[i][j] = matrix[i-1][j-1];
            else matrix[i][j] = Math.min(matrix[i-1][j-1]+1, matrix[i][j-1]+1, matrix[i-1][j]+1);
        }
    }
    return matrix[b.length][a.length];
  }

  function buildDictionary() {
    const words = new Set();
    flatResourcesCache.forEach(item => {
        item.searchText.toLowerCase().split(/\s+/).forEach(w => {
            if (w.length > 3) words.add(w);
        });
    });
    ['tesis', 'moodle', 'correo', 'revista', 'sigenu', 'repositorio', 'biblioteca', 'eventos', 'nube',
     'pregrado', 'posgrado', 'doctorado', 'maestria', 'virtual', 'aula', 'webmail', 'email'].forEach(w => words.add(w));
    return [...words];
  }

  const DICTIONARY = buildDictionary();
  const DICTIONARY_SET = new Set(DICTIONARY);

  function correctWord(word) {
    if (word.length < 4) return word;
    if (DICTIONARY_SET.has(word)) return word;

    let bestMatch = word;
    let bestDist = 999;
    for (let dictWord of DICTIONARY) {
        const dist = levenshteinDistance(word, dictWord);
        if (dist < bestDist && dist <= 2) {
            bestDist = dist;
            bestMatch = dictWord;
        }
    }
    return bestMatch;
  }

  // ===== TF-IDF =====
  let IDF_SCORES = {};

  function calculateIDF() {
    const docCount = flatResourcesCache.length;
    const wordDocs = {};

    flatResourcesCache.forEach(item => {
        const words = new Set(item.searchText.toLowerCase().split(/\s+/));
        words.forEach(word => {
            if (word.length > 2) {
                wordDocs[word] = (wordDocs[word] || 0) + 1;
            }
        });
    });

    for (let [word, count] of Object.entries(wordDocs)) {
        IDF_SCORES[word] = Math.log(docCount / (count + 1)) + 1;
    }
  }

  calculateIDF();

  // ===== SUGERENCIAS =====
  function getSuggestions(query) {
    const related = {
        'notas': ['sigenu', 'calificaciones', 'expediente'],
        'correo': ['email', 'webmail', 'buzon'],
        'moodle': ['aula virtual', 'evea', 'cursos'],
        'tesis': ['repositorio', 'trabajo diploma', 'investigacion'],
        'revista': ['articulos', 'publicaciones', 'journal'],
        'sigenu': ['notas', 'calificaciones', 'secretaria'],
        'evea': ['moodle', 'aula virtual', 'plataforma'],
        'repositorio': ['tesis', 'documentos', 'dspace'],
        'biblioteca': ['libros', 'catalogo', 'documentos'],
        'eventos': ['congreso', 'conferencia', 'taller'],
        'aula': ['moodle', 'virtual', 'clases', 'evea'],
        'nube': ['almacenamiento', 'drive', 'nextcloud']
    };

    const words = query.toLowerCase().split(/\s+/);
    const suggestions = new Set();

    words.forEach(w => {
        const corrected = correctWord(w);
        if (corrected !== w) suggestions.add(corrected);

        for (let [key, values] of Object.entries(related)) {
            if (w.includes(key) || key.includes(w)) {
                values.forEach(v => suggestions.add(v));
                suggestions.add(key);
            }
        }
    });

    return [...suggestions].filter(s => !words.includes(s)).slice(0, 4);
  }

  // ===== BÚSQUEDA INTELIGENTE =====
  const TYPE_KEYWORDS = {
    'Repositorio Institucional': ['tesis', 'investigacion', 'paper', 'documento', 'dspace', 'acceso abierto'],
    'Correo electrónico': ['correo', 'email', 'webmail', 'buzon', 'bandeja', 'mensaje', 'login'],
    'EVEA Pregrado': ['moodle', 'aula', 'curso', 'clase', 'asignatura', 'pregrado', 'grado'],
    'EVEA Posgrado': ['moodle', 'posgrado', 'maestria', 'doctorado', 'superacion'],
    'Revista Científica': ['revista', 'articulo', 'paper', 'journal', 'publicacion', 'editorial'],
    'Sitio Web Biblioteca': ['biblioteca', 'libro', 'catalogo', 'consulta', 'prestamo'],
    'SIGENU': ['notas', 'calificacion', 'expediente', 'matricula', 'secretaria', 'academico'],
    'Sitio Web Eventos': ['evento', 'congreso', 'conferencia', 'taller', 'simposio', 'jornada'],
    'Nube': ['nube', 'almacenamiento', 'drive', 'nextcloud', 'archivo', 'compartir'],
    'Observatorio': ['observatorio', 'indicador', 'metrica', 'vigilancia', 'monitoreo'],
    'Videoconferencia': ['videoconferencia', 'jitsi', 'meet', 'reunion', 'virtual'],
    'VPN': ['vpn', 'acceso remoto', 'red privada', 'conexion segura']
  };

  function detectQuestionPattern(query) {
    const queryLower = query.toLowerCase();
    const patterns = [];

    if (/donde|dónde/.test(queryLower) && /encuentro|encuentra|hay|esta|está/.test(queryLower)) {
        patterns.push({ type: 'location', weight: 10 });
    }

    if (/como|cómo|accedo|acceder|entro|entrar|ingreso|ingresar/.test(queryLower)) {
        patterns.push({ type: 'access', weight: 10 });
    }

    if (/necesito|busco|quiero|ocupo/.test(queryLower)) {
        patterns.push({ type: 'need', weight: 8 });
    }

    const deMatch = queryLower.match(/(\w+)\s+de\s+(\w+)/);
    if (deMatch) {
        patterns.push({ type: 'of_relation', word1: deMatch[1], word2: deMatch[2], weight: 15 });
    }

    const paraMatch = queryLower.match(/(\w+)\s+para\s+(\w+)/);
    if (paraMatch) {
        patterns.push({ type: 'for_relation', word1: paraMatch[1], word2: paraMatch[2], weight: 15 });
    }

    return patterns;
  }

  function intelligentSearch(query) {
    const queryLower = query.toLowerCase();
    const stopwords = ['el','la','los','las','un','una','de','del','en','con','para','por','que','donde','como','puedo','necesito','busco','quiero','acceder','entrar','hay','esta'];

    let rawKeywords = queryLower.replace(/[¿?¡!.,;:]/g,'').split(/\s+/).filter(w => w.length > 2 && !stopwords.includes(w));
    const keywords = rawKeywords.map(w => correctWord(w));

    let bestIntent = null;
    let bestScore = 0;
    for (let [intent, config] of Object.entries(SEARCH_PATTERNS)) {
        let score = 0;
        config.keywords.forEach(kw => { if (queryLower.includes(kw)) score++; });
        keywords.forEach(kw => { if (config.keywords.some(ck => ck.includes(kw) || kw.includes(ck))) score += 0.5; });
        if (score > bestScore) { bestScore = score; bestIntent = config; }
    }

    for (let [phrase, config] of Object.entries(COMMON_PHRASES)) {
        if (queryLower.includes(phrase)) {
            if (!bestIntent || config.weight > bestScore) {
                bestIntent = SEARCH_PATTERNS[config.intent];
                bestScore = config.weight;
            }
        }
    }

    const questionPatterns = detectQuestionPattern(query);

    let targetUniversity = null;
    for (let [uniId, aliases] of Object.entries(universityAliases)) {
        for (let alias of aliases) {
            if (queryLower.includes(alias.toLowerCase())) {
                targetUniversity = uniId;
                break;
            }
        }
        if (targetUniversity) break;
    }

    if (!targetUniversity) {
        keywords.forEach(word => {
            for (let [uniId, aliases] of Object.entries(universityAliases)) {
                for (let alias of aliases) {
                    if (alias.includes(word) || word.includes(alias)) {
                        targetUniversity = uniId;
                        break;
                    }
                }
                if (targetUniversity) break;
            }
        });
    }

    const scoredResults = [];

    flatResourcesCache.forEach(item => {
        let score = 0;
        const searchText = normalizeText(item.searchText.toLowerCase());
        const title = item.resource.title.toLowerCase();
        const type = item.resource.type.toLowerCase();
        const uniName = item.universityName.toLowerCase();

        keywords.forEach(word => {
            if (searchText.includes(word) && IDF_SCORES[word]) score += IDF_SCORES[word] * 5;
            if (title.includes(word) && IDF_SCORES[word]) score += IDF_SCORES[word] * 8;
        });

        if (bestIntent && bestScore > 0) {
            if (bestIntent.targetTypes.some(t => type.includes(t.toLowerCase()))) {
                score += bestIntent.weight * bestScore;
            }
        }

        keywords.forEach(word => {
            if (title.includes(word)) {
                score += 15;
                if (title.startsWith(word)) score += 10;
            }
            if (type.includes(word)) score += 10;
            if (searchText.includes(word)) score += 5;
            const exactRegex = new RegExp('\\b' + word + '\\b', 'i');
            if (exactRegex.test(title)) score += 15;
            if (exactRegex.test(type)) score += 10;
        });

        for (let [typeName, typeKeywords] of Object.entries(TYPE_KEYWORDS)) {
            if (type.includes(typeName.toLowerCase()) || title.includes(typeName.toLowerCase())) {
                typeKeywords.forEach(tk => {
                    keywords.forEach(kw => {
                        if (kw.includes(tk) || tk.includes(kw)) {
                            score += 12;
                        }
                    });
                });
            }
        }

        questionPatterns.forEach(pattern => {
            if (pattern.type === 'of_relation') {
                if (title.includes(pattern.word1) && searchText.includes(pattern.word2)) score += pattern.weight;
                if (type.includes(pattern.word1) && title.includes(pattern.word2)) score += pattern.weight;
            }
            if (pattern.type === 'for_relation') {
                if (title.includes(pattern.word1) && searchText.includes(pattern.word2)) score += pattern.weight;
            }
            if (pattern.type === 'access' && (type.includes('correo') || type.includes('login'))) score += pattern.weight;
            if (pattern.type === 'location' && (type.includes('repositorio') || type.includes('biblioteca'))) score += pattern.weight;
            if (pattern.type === 'need') score += pattern.weight;
        });

        if (targetUniversity && item.universityId === targetUniversity) score += 100;
        keywords.forEach(word => { if (uniName.includes(word)) score += 15; });

        keywords.forEach(word => {
            for (let [area, synonyms] of Object.entries(AREA_SYNONYMS)) {
                if (synonyms.some(s => word.includes(s) || s.includes(word))) {
                    if (searchText.includes(area) || synonyms.some(s => searchText.includes(s))) score += 15;
                    if (area === 'informatica' && item.universityId === 'uci') score += 20;
                    if (area === 'ingenieria' && item.universityId === 'cujae') score += 20;
                    if (area === 'geologia' && item.universityId === 'umoa') score += 20;
                    if (area === 'pedagogia' && ['uniss', 'ucf', 'uho'].includes(item.universityId)) score += 15;
                    if (area === 'agricultura' && ['upr', 'unica', 'uc'].includes(item.universityId)) score += 15;
                }
            }
        });

        if (/estudiante|alumno|pregrado/i.test(queryLower)) {
            if (type.includes('pregrado') || title.includes('estudiante') || title.includes('pregrado')) score += 15;
        }
        if (/profesor|docente|trabajador/i.test(queryLower)) {
            if (type.includes('posgrado') || title.includes('profesor') || title.includes('trabajador')) score += 15;
        }
        if (/investigador|investigacion/i.test(queryLower)) {
            if (type.includes('repositorio') || type.includes('revista') || type.includes('observatorio')) score += 15;
        }

        if (searchText.includes(queryLower)) score += 20;
        if (title.includes(queryLower)) score += 30;

        if (score > 0) scoredResults.push({ ...item, score });
    });

    if (targetUniversity) {
        flatResourcesCache.forEach(item => {
            if (item.universityId === targetUniversity) {
                const existing = scoredResults.find(r => r.resource.url === item.resource.url);
                if (existing) {
                    existing.score += 50;
                } else {
                    scoredResults.push({ ...item, score: 50 });
                }
            }
        });
    }

    const seen = new Set();
    return scoredResults
        .sort((a, b) => b.score - a.score)
        .filter(item => { const key = item.resource.url; if (seen.has(key)) return false; seen.add(key); return true; })
        .slice(0, 20);
  }

  function highlightText(element, searchTerm) {
    if (!searchTerm || searchTerm.length < 2) return;

    const words = searchTerm.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    if (words.length === 0) return;

    const titles = element.querySelectorAll('.resource-title');
    const types = element.querySelectorAll('.resource-type');

    [...titles, ...types].forEach(el => {
        const originalText = el.textContent;
        let newHTML = originalText;
        let changed = false;

        words.forEach(word => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedWord})`, 'gi');

            if (regex.test(originalText)) {
                newHTML = newHTML.replace(regex, '<mark class="search-highlight">$1</mark>');
                changed = true;
            }
        });

        if (changed) {
            el.innerHTML = newHTML;
        }
    });
  }

  function performSearch() {
    const rawSearchTerm = searchInput.value.trim().toLowerCase();
    const searchTerm = normalizeText(rawSearchTerm);
    const searchWords = normalizeText(rawSearchTerm).split(/\s+/).filter(word => word.length > 0);

    if (universityDetailView.style.display === 'block') {
      universitiesListView.style.display = 'block';
      universityDetailView.style.display = 'none';
      currentUniversity = null;
    }

    noResultsMessage.style.display = 'none';

    if (searchTerm === '') {
      renderUniversitiesList();
      return;
    }

    let matchedResources = [];
    const smartResults = intelligentSearch(rawSearchTerm);

    if (smartResults.length > 0) {
        smartResults.forEach(result => {
            matchedResources.push({
                universityId: result.universityId,
                universityName: result.universityName,
                universityLogo: result.universityLogo,
                resource: result.resource
            });
        });
    }

    if (matchedResources.length === 0) {
        const results = fuseInstance.search(rawSearchTerm);
        results.forEach(result => {
            const exists = matchedResources.some(r => r.resource.url === result.item.resource.url);
            if (!exists) {
                matchedResources.push({
                    universityId: result.item.universityId,
                    universityName: result.item.universityName,
                    universityLogo: result.item.universityLogo,
                    resource: result.item.resource
                });
            }
        });
    }

    if (searchWords.includes('tesis') || searchWords.includes('tesis-pregrado') ||
        searchWords.includes('tesis-maestria') || searchWords.includes('tesis-doctorado')) {
      matchedResources = matchedResources.filter(item => {
        const searchTags = normalizeText(item.resource.searchTags || '').toLowerCase();
        const type = item.resource.type.toLowerCase();
        const title = normalizeText(item.resource.title).toLowerCase();
        const tipoProhibido = TIPOS_PROHIBIDOS_PARA_TESIS.some(tipo => type.includes(tipo) || title.includes(tipo));
        if (tipoProhibido) return false;
        return searchTags.includes('tesis');
      });
    }

    if (currentFilter !== 'all') {
      matchedResources = matchedResources.filter(item => {
        return filterResourcesByType([item.resource], currentFilter).length > 0;
      });
    }

    if (matchedResources.length === 0) {
      universitiesListContainer.innerHTML = '';
      noResultsMessage.style.display = 'block';
      const suggestions = getSuggestions(rawSearchTerm);
      const suggestionText = suggestions.length > 0 ? ` Prueba con: ${suggestions.join(', ')}` : '';
      noResultsMessage.textContent = `No se encontraron resultados para "${rawSearchTerm}".${suggestionText}`;
      isSearchMode = true;
      return;
    }

    isSearchMode = true;
    universitiesListContainer.innerHTML = '';

    const resultsByUniversity = {};
    matchedResources.forEach(item => {
      if (!resultsByUniversity[item.universityId]) {
        resultsByUniversity[item.universityId] = {
          universityId: item.universityId,
          universityName: item.universityName,
          universityLogo: item.universityLogo,
          resources: []
        };
      }
      const exists = resultsByUniversity[item.universityId].resources.some(r => r.url === item.resource.url);
      if (!exists) {
        resultsByUniversity[item.universityId].resources.push(item.resource);
      }
    });

    Object.values(resultsByUniversity).forEach(uniData => {
      const universityHeader = document.createElement('div');
      universityHeader.className = 'search-result-header';
      universityHeader.innerHTML = `
        ${uniData.universityLogo ? `<img src="${uniData.universityLogo}" alt="Logo" class="search-result-logo">` : ''}
        <h3>${uniData.universityName}</h3>
        <span class="result-count">${uniData.resources.length} resultado${uniData.resources.length !== 1 ? 's' : ''}</span>
      `;
      universitiesListContainer.appendChild(universityHeader);

      uniData.resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card resource-card-search';
        resourceCard.innerHTML = `
          <div class="resource-card-actions">
            <button class="favorite-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Añadir a favoritos">☆</button>
            <button class="copy-link-btn" data-url="${resource.url}" aria-label="Copiar enlace">${SVG_COPY}</button>
            <button class="share-btn" data-url="${resource.url}" data-title="${resource.title}" aria-label="Compartir enlace">${SVG_SHARE}</button>
          </div>
          <span class="resource-type">${resource.type}</span>
          <span class="resource-title">${resource.title}</span>
          <a href="${resource.url}" class="resource-link" target="_blank" rel="noopener noreferrer">${resource.url}</a>
        `;
        universitiesListContainer.appendChild(resourceCard);

        const favBtn = resourceCard.querySelector('.favorite-btn');
        const url = favBtn.getAttribute('data-url');
        favBtn.addEventListener('click', () => toggleFavorite(favBtn, url));
        if (favorites.some(fav => fav.url === url)) {
          favBtn.textContent = '★';
          favBtn.classList.add('active');
        }

        const copyBtn = resourceCard.querySelector('.copy-link-btn');
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = copyBtn.getAttribute('data-url');
          copyToClipboard(url);
          copyBtn.innerHTML = SVG_CHECK;
          setTimeout(() => { copyBtn.innerHTML = SVG_COPY; }, 1500);
        });

        const shareBtn = resourceCard.querySelector('.share-btn');
        shareBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const url = shareBtn.getAttribute('data-url');
          const title = shareBtn.getAttribute('data-title');
          shareResource(url, title);
        });
      });
    });

    highlightText(universitiesListContainer, rawSearchTerm);
  }

  // ========== TOGGLE FAVORITO ==========
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

  // ========== COPIAR ENLACE ==========
  function copyToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Enlace copiado al portapapeles', 'success');
    }).catch(err => {
      showToast('No se pudo copiar el enlace', 'error');
    });
  }

  // ===== FUNCIÓN COMPARTIR =====
  function shareResource(url, title) {
    if (navigator.share) {
      navigator.share({ title: title || 'SaberCuba', url: url }).catch(function() {});
    } else {
      showToast('Compartir no disponible en este dispositivo', 'error');
    }
  }

  // ========== TOAST ==========
  function showToast(message, type = 'success') {
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const icon = type === 'error' ? SVG_CLOSE : SVG_CHECK;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `${icon}<span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // ========== MOSTRAR FAVORITOS ==========
  function showFavorites() {
    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
      favoritesList.innerHTML = '<li>No tienes favoritos guardados</li>';
    } else {
      favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `
          <button class="remove-favorite" data-index="${index}" aria-label="Eliminar favorito">${SVG_CLOSE}</button>
          <a href="${fav.url}" target="_blank" rel="noopener noreferrer">${fav.title}</a>
        `;
        favoritesList.appendChild(li);
      });
      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.getAttribute('data-index'));
          removeFavorite(idx);
        });
      });
    }
    favoritesModal.style.display = 'block';
  }

  function removeFavorite(index) {
    const removed = favorites[index];
    document.querySelectorAll(`.favorite-btn[data-url="${removed.url}"]`).forEach(btn => {
      btn.textContent = '☆';
      btn.classList.remove('active');
    });
    favorites.splice(index, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
  }

  // ========== HISTORIAL ==========
  function addToHistory(url, title) {
    if (visitHistory.length > 0 && visitHistory[0].url === url) return;
    visitHistory.unshift({ url, title, timestamp: new Date().toLocaleString() });
    if (visitHistory.length > 20) visitHistory = visitHistory.slice(0, 20);
    localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
  }

  function showHistory() {
    historyList.innerHTML = '';
    if (visitHistory.length === 0) {
      historyList.innerHTML = '<li>No hay enlaces en el historial</li>';
    } else {
      visitHistory.slice(0, 10).forEach((item) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `<a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a><span style="font-size: 0.7rem; color: var(--text-secondary);">${item.timestamp}</span>`;
        historyList.appendChild(li);
      });
    }
    historyModal.style.display = 'block';
  }

  function clearHistory() {
    visitHistory = [];
    localStorage.removeItem('visitHistory');
    showHistory();
  }

  // ========== LINKS PERSONALIZADOS ==========
  function showCustomLinks() {
    customLinksList.innerHTML = '';
    if (customLinks.length === 0) {
      customLinksList.innerHTML = '<li>No tienes links guardados. Usa el formulario para añadir uno.</li>';
    } else {
      customLinks.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `
          <button class="delete-custom-link" data-index="${index}" aria-label="Eliminar link">${SVG_CLOSE}</button>
          <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>
        `;
        customLinksList.appendChild(li);
      });
      document.querySelectorAll('.delete-custom-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteCustomLink(parseInt(e.currentTarget.getAttribute('data-index')));
        });
      });
    }
    customLinksModal.style.display = 'block';
  }

  function deleteCustomLink(index) {
    customLinks.splice(index, 1);
    localStorage.setItem('customLinks', JSON.stringify(customLinks));
    showCustomLinks();
  }

  function saveNewLink() {
    const title = newLinkTitle.value.trim();
    let url = newLinkUrl.value.trim();

    if (!title || !url) {
      showToast('Por favor, completa ambos campos', 'error');
      return;
    }

    if (!url.startsWith('http')) url = 'https://' + url;

    customLinks.push({ title, url });
    localStorage.setItem('customLinks', JSON.stringify(customLinks));
    newLinkTitle.value = '';
    newLinkUrl.value = '';
    showCustomLinks();

    showToast('Link guardado correctamente', 'success');
  }

  // ===== Limpiar caché con historial protegido =====
  function clearAppCache() {
    showConfirm(
      'Limpiar caché',
      '¿Estás seguro de limpiar la caché de la aplicación?\n\nEsto eliminará datos temporales y puede liberar espacio.',
      () => {
        const savedFavorites = localStorage.getItem('favorites');
        const savedCustomLinks = localStorage.getItem('customLinks');
        const savedTheme = localStorage.getItem('theme');
        const savedHistory = localStorage.getItem('visitHistory');
        const savedFilters = localStorage.getItem(FILTERS_STORAGE_KEY);

        localStorage.clear();

        if (savedFavorites) localStorage.setItem('favorites', savedFavorites);
        if (savedCustomLinks) localStorage.setItem('customLinks', savedCustomLinks);
        if (savedTheme) localStorage.setItem('theme', savedTheme);
        if (savedHistory) localStorage.setItem('visitHistory', savedHistory);
        if (savedFilters) localStorage.setItem(FILTERS_STORAGE_KEY, savedFilters);

        if (window.caches) {
          caches.keys().then(names => {
            names.forEach(name => caches.delete(name));
          });
        }

        showToast('Caché limpiada correctamente', 'success');
        setTimeout(() => location.reload(), 800);
      }
    );
  }

  // ========== ACERCA DE Y OPINIÓN ==========
  function showAbout() { aboutModal.style.display = 'block'; }

  // ===== Modal de Valoración =====
  function showRatingModal() {
    ratingModal.style.display = 'block';
  }

  function sendFeedback() {
    window.location.href = `mailto:cocabenapps@gmail.com?subject=${encodeURIComponent('Opinión sobre SaberCuba')}&body=${encodeURIComponent('Hola, mi opinión sobre SaberCuba:\n\n')}`;
  }

  function openApklis() {
    window.open('https://www.apklis.cu/application/cu.cocabenapps.sabercuba', '_blank');
  }

  // ========== REGISTRAR CLICS ==========
  document.addEventListener('click', function(e) {
    const link = e.target.closest('.resource-link');
    if (link) {
      addToHistory(link.href, link.getAttribute('data-title') || link.textContent || link.href);
    }
  });

  // ========== EVENT LISTENERS ==========
  renderUniversitiesList();
  backToListBtn.addEventListener('click', backToList);
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });

  // Lógica del botón Limpiar Búsqueda
  searchInput.addEventListener('input', () => {
    if (searchInput.value.length > 0) {
      clearSearchBtn.style.display = 'flex';
    } else {
      clearSearchBtn.style.display = 'none';
    }
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    searchInput.focus();
    performSearch();
  });

  hamburger.addEventListener('click', () => { navMenu.classList.toggle('active'); hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active')); });
  document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { navMenu.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); }); });
  favoritesLink.addEventListener('click', (e) => { e.preventDefault(); showFavorites(); });
  historyLink.addEventListener('click', (e) => { e.preventDefault(); showHistory(); navMenu.classList.remove('active'); });
  customLinksLink.addEventListener('click', (e) => { e.preventDefault(); showCustomLinks(); navMenu.classList.remove('active'); });
  clearCacheLink.addEventListener('click', (e) => { e.preventDefault(); clearAppCache(); navMenu.classList.remove('active'); });
  aboutLink.addEventListener('click', (e) => { e.preventDefault(); showAbout(); navMenu.classList.remove('active'); });

  // Abrir modal de valoración al hacer clic en "Valorar"
  feedbackLink.addEventListener('click', (e) => { e.preventDefault(); showRatingModal(); navMenu.classList.remove('active'); });

  // Listeners del Modal de Valoración
  ratingEmailBtn.addEventListener('click', () => {
    ratingModal.style.display = 'none';
    sendFeedback();
  });

  ratingApklisBtn.addEventListener('click', () => {
    ratingModal.style.display = 'none';
    openApklis();
  });

  saveNewLinkBtn.addEventListener('click', saveNewLink);
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

  closeModal.forEach(btn => btn.addEventListener('click', () => favoritesModal.style.display = 'none'));

  document.querySelectorAll('.close-history, .close-custom, .close-about, .close-rating').forEach(btn => btn.addEventListener('click', () => { 
      historyModal.style.display = 'none'; 
      customLinksModal.style.display = 'none'; 
      aboutModal.style.display = 'none'; 
      ratingModal.style.display = 'none'; 
  }));

  window.addEventListener('click', (event) => {
      if (event.target === favoritesModal) favoritesModal.style.display = 'none';
      if (event.target === historyModal) historyModal.style.display = 'none';
      if (event.target === customLinksModal) customLinksModal.style.display = 'none';
      if (event.target === aboutModal) aboutModal.style.display = 'none';
      if (event.target === confirmModal) confirmModal.style.display = 'none';
      if (event.target === ratingModal) ratingModal.style.display = 'none';
  });

  // ===== SCROLL TO TOP =====
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== TEMA =====
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    document.documentElement.classList.toggle('light-mode', document.body.classList.contains('light-mode'));
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.innerHTML = isLight 
        ? '<svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>'
        : '<svg class="theme-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // ===== LISTENER DEL TOGGLE DE FILTROS =====
  if (filterToggleBtn) {
    filterToggleBtn.addEventListener('click', () => {
      const willOpen = !filterContainer.classList.contains('open');
      updateFilterToggleUI(willOpen);
      localStorage.setItem(FILTERS_STORAGE_KEY, willOpen ? 'true' : 'false');
    });
  }

  // Estado inicial de los filtros (leer de localStorage)
  const savedFilterState = localStorage.getItem(FILTERS_STORAGE_KEY) === 'true';
  updateFilterToggleUI(savedFilterState);

  // ===== FILTROS =====
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterType = btn.getAttribute('data-filter');
      setActiveFilter(filterType);
    });
  });
});
