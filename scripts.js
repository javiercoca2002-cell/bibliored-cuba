document.addEventListener('DOMContentLoaded', function() {
  // ========== ELEMENTOS DEL DOM ==========
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
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

  // ========== NUEVOS ELEMENTOS DEL DOM ==========
  const historyLink = document.getElementById('historyLink');
  const customLinksLink = document.getElementById('customLinksLink');
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

  // ========== ELEMENTOS DE FILTRO ==========
  const filterButtons = document.querySelectorAll('.filter-btn');

  // ========== VARIABLES GLOBALES ==========
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let currentUniversity = null;
  let isSearchMode = false;
  let visitHistory = JSON.parse(localStorage.getItem('visitHistory')) || [];
  let customLinks = JSON.parse(localStorage.getItem('customLinks')) || [];
  let currentFilter = 'all';
  
  // ========== DATOS DE UNIVERSIDADES ==========
  /* ===== PEGA AQUÍ TU ARRAY universitiesData ===== */
  const universitiesData = [
  {
  "id": "upr",
  "name": "UPR (Universidad de Pinar del Río)",
  "logo": "logos/upr.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.upr.edu.cu/home",
      "title": "Portal principal de la Universidad de Pinar del Río",
      "searchTags": "portal institucional noticias inicio universidad pinar del rio hermanos saiz montes oca upr cuba educacion superior pregrado posgrado carreras universitarias investigacion innovacion extension facultades campus matricula estudiantes profesores rectoria eventos cientificos academicos certificada excelencia"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://eventos.upr.edu.cu/home",
      "title": "Plataforma de gestión de eventos científicos y académicos",
      "searchTags": "eventos cientificos academicos congresos convenciones talleres jornadas simposios ponencias conferencias seminarios foros inscripcion calendario programa comite organizador cientifico certificacion participantes expositores carteles debate investigacion extension upr pinar del rio"
    },
    {
      "type": "Observatorio",
      "url": "https://sciobs.upr.edu.cu/indicators",
      "title": "Observatorio de Ciencia y Tecnología - indicadores métricos",
      "searchTags": "observatorio cientifico ciencia tecnologia cienciometria indicadores metricos vigilancia tecnologica inteligencia competitiva metricas produccion cientifica investigacion desarrollo innovacion progintec gestion informacion conocimiento tecnologias upr pinar del rio universidad"
    },
    {
      "type": "Observatorio",
      "url": "https://techobs.upr.edu.cu/indicators",
      "title": "Observatorio Tecnológico - vigilancia e inteligencia",
      "searchTags": "observatorio tecnologico vigilancia tecnologica inteligencia competitiva prospectiva tendencias innovacion tecnologia patentes desarrollo tecnologico monitoreo estrategia competitividad transferencia tecnologia analisis informacion sectorial upr pinar del rio universidad"
    },
    {
      "type": "Observatorio",
      "url": "https://tareavida.upr.edu.cu/home",
      "title": "Observatorio Tarea Vida - cambio climático",
      "searchTags": "observatorio tarea vida cambio climatico medio ambiente sostenibilidad ambiental monitoreo ambiental indicadores ambientales vader progintec plan estado cubano calentamiento global ecosistemas biodiversidad recursos naturales desarrollo sostenible upr pinar del rio universidad"
    },
    {
      "type": "EVEA Pregrado",
      "url": "http://aulas-virtuales.upr.edu.cu/",
      "title": "Aula virtual de pregrado (plataforma Moodle)",
      "searchTags": "aula virtual pregrado moodle plataforma educativa cursos asignaturas estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes aprendizaje semipresencial upr pinar del rio universidad"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://moodle.upr.edu.cu/",
      "title": "Entorno virtual de enseñanza-aprendizaje para cursos de grado",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa entorno virtual aprendizaje estudiantes profesores matricula clases material didactico tareas foros glosarios cuestionarios examenes encuestas boletines horario docente pedagogia digital tic educacion inteligencia artificial chatgpt machine learning deep learning aula invertida taxonomia bloom interactividad didactica creativa centro idiomas ciencias tecnicas ciencias economicas ciencias forestales agropecuarias cultura fisica educacion infantil educacion media formacion tecnico superior upr pinar del rio universidad"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://moodle.ceces.upr.edu.cu/moodle/",
      "title": "EVEA para formación posgraduada y superación profesional",
      "searchTags": "moodle aula virtual posgrado postgrado ceces centro estudios ciencias educacion superior formacion posgraduada maestrias doctorados superacion profesional cursos abiertos capacitacion ciencias educacion pedagogia agricolas forestales ambientales tecnicas sociales humanisticas economicas empresariales cultura fisica escuela doctoral cuadros idioma plataforma educativa estudiantes profesores investigadores upr pinar del rio universidad"
    },
    {
      "type": "EVEA EaD",
      "url": "https://moodleed.upr.edu.cu/",
      "title": "Plataforma de educación a distancia (modalidad semipresencial)",
      "searchTags": "moodle educacion distancia ead cursos encuentro cpe modalidad semipresencial virtual plataforma educativa aprendizaje online estudiar cualquier lugar ordenador portatil tablet telefono movil autoaprendizaje matricula gratuita cums centros universitarios municipales licenciatura derecho gestion sociocultural contabilidad cursos abiertos mooc chatgpt inteligencia artificial diseno cursos virtuales contenidos educativos upr pinar del rio universidad"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://rc.upr.edu.cu/",
      "title": "Repositorio científico institucional de acceso abierto",
      "searchTags": "repositorio cientifico institucional alma dspace produccion cientifica academica tesis doctorado maestria especialidades articulos libros ponencias eventos docentes investigadores acceso abierto open access comunidades colecciones autores materias tematicas educacion ambiental adulto mayor desarrollo sostenible ensenanza aprendizaje capacitacion direccion opendoar google scholar openaire road openroar issn 2520-9086 crai biblioteca upr pinar del rio hermanos saiz montes oca universidad"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://earchivos.upr.edu.cu",
      "title": "Portal de la Biblioteca Universitaria y recursos electrónicos",
      "searchTags": "e-archivos biblioteca digital universitaria documentos electronicos libros articulos legislaciones leyes decretos normas trabajos diploma tesis pregrado revistas cientificas monografias autoarchivo acceso abierto preservacion digital consulta comunidad universitaria egresados provincia pinar del rio dspace crai upr hermanos saiz montes oca universidad"
    },
    {
      "type": "Revista Científica",
      "url": "https://mendive.upr.edu.cu/index.php/MendiveUPR",
      "title": "Revista Mendive - Ciencias de la Educación",
      "searchTags": "revista cientifica mendive ciencias educacion upr pinar del rio"
    },
    {
      "type": "Revista Científica",
      "url": "https://podium.upr.edu.cu/index.php/podium",
      "title": "Revista PODIUM - Cultura Física y Deporte",
      "searchTags": "revista cientifica podium cultura fisica deporte upr pinar del rio"
    },
    {
      "type": "Revista Científica",
      "url": "https://coodes.upr.edu.cu/index.php/coodes",
      "title": "Revista COODES - Cooperativismo y Desarrollo",
      "searchTags": "revista cientifica coodes cooperativismo desarrollo upr pinar del rio"
    },
    {
      "type": "Revista Científica",
      "url": "https://cifam.upr.edu.cu/index.php/cifam",
      "title": "Revista CIFAM - Ciencias Farmacéuticas y Alimentarias",
      "searchTags": "revista cientifica cifam ciencias farmaceuticas alimentarias upr pinar del rio"
    },
    {
      "type": "Revista Científica",
      "url": "https://cfores.upr.edu.cu/index.php/cfores",
      "title": "Revista CFORES - Ciencias Forestales y Ambientales",
      "searchTags": "revista cientifica cfores ciencias forestales ambientales upr pinar del rio"
    },
    {
      "type": "Revista Científica",
      "url": "https://sceiba.reduniv.edu.cu/",
      "title": "Portal de revistas académicas de la Red de Universidades Cubanas",
      "searchTags": "sceiba portal revistas academicas cientificas red universidades cubanas reduniv publicaciones periodicas articulos investigacion ciencia directorio metabuscador agregador nacional acceso abierto"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.upr.edu.cu/",
      "title": "Servicio de correo electrónico institucional para profesores y trabajadores",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos upr pinar del rio"
    },
    {
      "type": "Correo electrónico",
      "url": "https://estudiantes.upr.edu.cu/",
      "title": "Correo electrónico para estudiantes de la UPR",
      "searchTags": "correo electronico estudiantes webmail zimbra email estudiantil login acceso bandeja entrada mensajes buzon correo alumnos universitario upr pinar del rio"
    }
  ]
},
  {
  "id": "ua",
  "name": "UA (Universidad de Artemisa)",
  "logo": "logos/ua.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://ua.uart.edu.cu",
      "title": "Portal oficial de la Universidad de Artemisa",
      "searchTags": "portal institucional noticias inicio universidad artemisa ua cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus artemiseño"
    },
    {
      "type": "Sitio Web",
      "url": "https://redsocial.uart.edu.cu",
      "title": "Red social académica para la comunidad universitaria",
      "searchTags": "red social academica comunidad universitaria perfil publicaciones grupos debates foros noticias intercambio colaboracion ua universidad artemisa"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://uva.uart.edu.cu",
      "title": "Aula virtual de pregrado basada en Moodle",
      "searchTags": "moodle uva aula virtual pregrado entorno virtual aprendizaje cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes ua universidad artemisa"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://repositorio.uart.edu.cu",
      "title": "Repositorio digital de tesis, trabajos de diploma y maestría",
      "searchTags": "repositorio digital institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos publicaciones academicas cientificas produccion cientifica acceso abierto open access comunidades colecciones ua universidad artemisa"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://ftp.uart.edu.cu",
      "title": "Servidor FTP con libros, documentos y software académico",
      "searchTags": "ftp servidor archivos descargas libros documentos software academico bibliografia utilidades herramientas informaticas repositorio archivos compartidos ua universidad artemisa"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistavillena.uart.edu.cu",
      "title": "Revista Villena - difusión de resultados científicos de la UA",
      "searchTags": "revista cientifica villena publicacion cientifica articulos investigacion multidisciplinaria difusion cientifica resultados academicos ua universidad artemisa"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.uart.edu.cu",
      "title": "Plataforma de correo electrónico institucional",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos colaboracion calendario contactos ua universidad artemisa"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenus.uart.edu.cu",
      "title": "Sistema de Gestión Universitaria (control académico y matrícula)",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores ua universidad artemisa"
    }
  ]
},
  {
  "id": "uh",
  "name": "UH (Universidad de La Habana)",
  "logo": "logos/uh.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "http://www.uh.cu",
      "title": "Sitio web oficial de la Universidad de La Habana",
      "searchTags": "portal institucional noticias inicio universidad la habana uh habana cuba excelencia academica pregrado posgrado investigacion innovacion extension internacionalizacion facultades centros estudio historia patrimonio rectores doctores honoris causa alumni consejo universitario residencia estudiantil cursos verano colegio preuniversitario lineas investigacion programas proyectos premios publicaciones eventos fundacion uh catedras cultura artistica literaria deporte universidad popular jose marti relaciones internacionales cooperacion internacional erasmus horizon tramites migratorios campus digital biblioteca correo entorno virtual repositorios revistas"
    },
    {
      "type": "Sitio Web Institucional",
      "url": "http://facultades.uh.cu",
      "title": "Directorio de facultades y dependencias de la UH",
      "searchTags": "directorio facultades dependencias uh universidad la habana estructura claustro consejo direccion consejo cientifico departamentos docencia pregrado posgrado investigacion grupos investigacion lineas investigacion proyectos extension universitaria festival cultura caribes jornada cientifica carreras matricula profesores contacto intranet sitio web perfil institucional"
    },
    {
      "type": "Sitio Web Institucional",
      "url": "http://jbn.uh.cu",
      "title": "Portal de la Dirección de Ciencia, Tecnología e Innovación",
      "searchTags": "jardin botanico nacional ciencia tecnologia innovacion direccion naturaleza plantas preservacion medio ambiente investigacion cientifica educacion ambiental recreacion exposicion vegetal cubana tropicos especies pabellones tematicos cactus suculentas bosques humedos tropicales montana zonas botanicas bosque arcaico palmetum pinares jardin japones cascada restaurante bambu servicios turismo nacional conferencias charlas herbario biblioteca revista cientifica galeria imagenes videos contacto uh universidad la habana"
    },
    {
      "type": "Sitio Web",
      "url": "http://sic.uh.cu",
      "title": "Sistema de Información Científica de la UH",
      "searchTags": "sistema informatica comunicaciones sic uh universidad la habana tecnologia informacion servicios telematicos redes"
    },
    {
      "type": "Sitio Web",
      "url": "http://dime.uh.cu",
      "title": "Dirección de Informatización y Medios Educativos",
      "searchTags": "informatizacion medios educativos direccion dime uh universidad la habana tecnologia educativa campus digital"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "http://eventos.uh.cu",
      "title": "Gestión de eventos y congresos académicos",
      "searchTags": "eventos congresos conferencias talleres simposios convenciones reuniones presentaciones concursos forum cientifico estudiantil indico inscripcion ponencias resumenes calendario estadisticas categorias universidad la habana uh"
    },
    {
      "type": "EVEA Pregrado",
      "url": "http://evea.uh.cu",
      "title": "Entorno Virtual de Enseñanza-Aprendizaje para pregrado",
      "searchTags": "moodle aula virtual entorno virtual enseñanza aprendizaje evea uh universidad la habana pregrado cursos asignaturas plataforma educativa login acceso estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes"
    },
    {
      "type": "EVEA Posgrado",
      "url": "http://programas.uh.cu",
      "title": "Plataforma de cursos de posgrado y doctorados",
      "searchTags": "programas academicos posgrado doctorado maestria diplomado cursos gestion academica comite academico grados cientificos formacion posgraduada uh universidad la habana biologia contabilidad finanzas turismo arte historia microbiologia bioquimica patrimonio cultural educacion superior gestion ambiental administracion publica lengua china meteorologia ecologia genetica molecular anatomia comercio exterior cooperacion internacional ciberseguridad seguridad transparencia fiabilidad"
    },
    {
      "type": "EVEA MOOCs",
      "url": "http://moocs.uh.cu",
      "title": "Cursos masivos abiertos en línea (MOOC) de la UH",
      "searchTags": "mooc cursos masivos abiertos en linea moodle plataforma educativa gratuita autoaprendizaje certificado uh universidad la habana login acceso estudiantes profesores matricula"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "http://accesoabierto.uh.cu",
      "title": "Portal de acceso abierto de la Biblioteca Central",
      "searchTags": "biblioteca central universidad la habana acceso abierto informacion cientifica catalogo opac bases datos revistas uh repositorio scriptorium coleccion fotos colecciones especiales nuevas adquisiciones titulos nuevos noticias cursos talleres seminarios busqueda recuperacion informacion herramientas tesis trabajos diploma asesoria gestion bibliotecas universitarias formacion proyectos contacto politicas uh"
    },
    {
      "type": "Repositorio - Scriptorium",
      "url": "https://accesoabierto.uh.cu/s/scriptorium/page/inicio",
      "title": "Scriptorium: Repositorio institucional de tesis y publicaciones académicas de la UH",
      "searchTags": "repositorio institucional scriptorium universidad la habana tesis doctorado maestria especialidad trabajo diploma pregrado articulos revistas cientificas libros academicos datos investigacion produccion cientifica acceso abierto preservacion difusion colecciones siglo xix siglo xx siglo xxi documentos texto completo biblioteca central direccion informacion uh"
    },
    {
      "type": "Revista Científica",
      "url": "http://revistas.uh.cu",
      "title": "Portal general de revistas científicas de la UH",
      "searchTags": "portal revistas universidad la habana publicaciones cientificas academicas acceso abierto ojs articulos investigacion ciencia multidisciplinaria indexacion scielo google academico base latindex amelica redalyc clacso editor digitalizacion biblioteca central direccion informacion sincopado habanero patrimonio musical bissea botanica conservacion plantas jardin botanico nacional upsalon facultad artes letras ciencias biologicas farmaceuticas alimentarias matematicas computacion diseño industrial comunicacion visual economia internacional psicologia desarrollo social flacso filosofia historia sociologia investigaciones marinas educacion superior informacion comunicacion contabilidad finanzas cofin habana fisica demografia poblacion novedades operacional"
    },
    {
      "type": "Revista Científica",
      "url": "http://a3manos.uh.cu",
      "title": "Revista A3Manos - ciencia, tecnología y sociedad",
      "searchTags": "revista a3manos articulo cientifico diseño industrial comunicacion visual diseño cubano investigacion ciencia tecnologia sociedad instituto superior diseño isdi uh universidad la habana pdf ojs"
    },
    {
      "type": "Correo electrónico",
      "url": "http://correo.uh.cu",
      "title": "Servicio de correo electrónico para profesores y personal administrativo",
      "searchTags": "correo electronico webmail roundcube email institucional login acceso bandeja entrada mensajes buzón correo profesores trabajadores administrativos universidad la habana uh soporte"
    },
    {
      "type": "Correo electrónico",
      "url": "http://correo.estudiantes.uh.cu",
      "title": "Correo electrónico para estudiantes de la UH",
      "searchTags": "correo electronico webmail roundcube email estudiantes institucional login acceso bandeja entrada mensajes buzón correo universidad la habana uh"
    },
    {
      "type": "SIGENU",
      "url": "http://sigenu.uh.cu",
      "title": "Sistema de gestión de la secretaría docente",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores universidad la habana uh"
    },
    {
      "type": "Nube",
      "url": "http://minube.uh.cu",
      "title": "Nube de almacenamiento y trabajo colaborativo",
      "searchTags": "nube universitaria nextcloud almacenamiento drive archivos compartir colaboracion calendario contactos correo chat videollamadas notas tareas office documentos universidad la habana uh alma saber entrega nube privada"
    },
    {
      "type": "VPN",
      "url": "http://vnet.uh.cu",
      "title": "Acceso remoto seguro a la red universitaria",
      "searchTags": "vpn acceso remoto red privada conexion segura universidad la habana uh vnet teletrabajo investigacion"
    }
  ]
},
  {
  "id": "uci",
  "name": "UCI (Universidad de las Ciencias Informáticas)",
  "logo": "logos/uci.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.uci.cu/",
      "title": "Portal oficial de la Universidad de las Ciencias Informáticas",
      "searchTags": "portal institucional noticias inicio uci universidad ciencias informaticas cuba pregrado posgrado investigacion innovacion extension facultades carreras ingenieria software computacion informatica matricula estudiantes profesores campus la habana boyeros"
    },
    {
      "type": "Sitio Web",
      "url": "https://admision.uci.cu/",
      "title": "Sitio de orientación vocacional y admisión universitaria",
      "searchTags": "admision ingreso matricula prematricula orientacion vocacional carreras universitarias pregrado posgrado cursos diplomados maestrias especialidades doctorados asesorias curso por encuentro estudiar informatica ciencia computacion solicitud inscripcion requisitos login acceso cuenta oferta academica formacion uci universidad ciencias informaticas"
    },
    {
      "type": "Sitio Web",
      "url": "https://drst.uci.cu/",
      "title": "Dirección de Redes y Servicios Telemáticos",
      "searchTags": "drst direccion redes servicios telematicos telecomunicaciones conectividad campus infraestructura red internet intranet proxy navegacion wifi inalambrica acceso remoto vpn autenticacion cas login cuenta dominio uci contraseña cambio recuperacion pwm manuales documentacion descargas software ucistore verificador solapin todus mensajeria instantanea cubana soporte tecnico wsus actualizaciones samba likewise correo zimbra outlook thunderbird encriptacion seguridad informatica noticias avisos tecnicos comunidad universitaria uci universidad ciencias informaticas"
    },
    {
      "type": "Sitio Web",
      "url": "https://cuenta.uci.cu/",
      "title": "Gestión unificada de cuentas de usuario",
      "searchTags": "cuenta usuario gestion unificada contraseña cambio recuperacion olvidada reset password pwm autoservicio perfil dominio uci autenticacion identidad acceso login credenciales seguridad verificacion uci universidad ciencias informaticas"
    },
    {
      "type": "Sitio Web",
      "url": "https://usuario.uci.cu/",
      "title": "Portal de autoservicio para cambio de contraseña",
      "searchTags": "usuario autoservicio cambio contraseña password reset recuperacion olvidada pwm dominio uci login acceso cuenta autenticacion credenciales perfil gestion identidad seguridad autogestion portal uci universidad ciencias informaticas"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://eva.uci.cu/",
      "title": "Entorno virtual de aprendizaje para pregrado (Moodle)",
      "searchTags": "moodle eva entorno virtual aprendizaje pregrado cursos asignaturas plataforma educativa login acceso estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes aula virtual uci universidad ciencias informaticas"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://aulacened.uci.cu/",
      "title": "Aula virtual del Centro Nacional de Educación a Distancia",
      "searchTags": "cened centro nacional educacion distancia aula virtual posgrado moodle postgrado cursos diplomados maestrias especialidades doctorado capacitacion formacion profesional avanzada asesorias desarrollo tecnologico acompainamiento evaluacion programas virtuales tutoria soporte tecnico pedagogico e-learning ensenanza aprendizaje educacion digital escuela invierno certificacion usuarios actividades documentos normativas colaboraciones faq preguntas frecuentes descarga moodle portable aplicacion movil facebook twitter correo cened@uci.cu uci universidad ciencias informaticas"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://repositorio.uci.cu/jspui/",
      "title": "Repositorio institucional de tesis, artículos y objetos de aprendizaje",
      "searchTags": "repositorio digital institucional dspace repxos tesis doctorado maestria pregrado trabajos diploma articulos libros publicaciones academicas cientificas produccion cientifica eventos cientificos acceso abierto open access comunidades colecciones autores materias tematicas desarrollo software informatica computacion ingenieria software programacion sistemas gestion aplicaciones web arquitectura software gestion informacion modelacion xabal uci universidad ciencias informaticas"
    },
    {
      "type": "Repositorio de código",
      "url": "https://gitlab.prod.uci.cu",
      "title": "Plataforma GitLab para desarrollo colaborativo de software",
      "searchTags": "gitlab forja repositorio codigo fuente desarrollo colaborativo software control versiones git merge request integracion continua ci cd despliegue proyecto programacion devops issues milestones wiki repositorio privado alojamiento codigo uci universidad ciencias informaticas"
    },
    {
      "type": "Revista Científica",
      "url": "https://rcci.uci.cu/index.php/RCCI",
      "title": "Revista Cubana de Ciencias Informáticas",
      "searchTags": "revista cientifica ciencias informaticas rcci computacion informatica articulo cientifico investigacion publicacion arbitraje pares academicos open journal systems ojs acceso abierto open access scielo latindex redalyc google scholar sherpa romeo e-revistas csic ediciones futuro editorial uci issn 2227-1899 rnps 2301 trimestral envios autores lectores original revision ciberseguridad aprendizaje profundo inteligencia artificial modelado computacional aplicaciones moviles eficiencia energetica datos sinteticos emociones uci universidad ciencias informaticas"
    },
    {
      "type": "Revista Científica",
      "url": "https://publicaciones.uci.cu/",
      "title": "Portal de publicaciones seriadas y libros académicos",
      "searchTags": "serie cientifica publicaciones revista multidisciplinaria tecnologias informacion tic articulo cientifico investigacion open journal systems ojs acceso abierto open access scielo redib doaj latindex drji dialnet ediciones futuro editorial uci issn 2306-2495 rnps 2343 trimestral envios autores lectores gratis sin cargos preprints datos investigacion arbitraje abierto iot inteligencia artificial realidad virtual modelamiento computacional educacion contratacion publica gobernanza digital ensenanza matematica uci universidad ciencias informaticas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.uci.cu/",
      "title": "Servicio de correo institucional para trabajadores",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzón correo profesores trabajadores administrativos colaboracion calendario contactos tareas suite avanzado ajax estandar html movil recordarme contrasena seguridad uci universidad ciencias informaticas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.estudiantes.uci.cu/",
      "title": "Correo electrónico estudiantil de la UCI",
      "searchTags": "correo electronico estudiantes webmail zimbra email estudiantil login acceso bandeja entrada mensajes buzón correo alumnos pregrado universitario colaboracion calendario contactos recordarme contrasena seguridad uci universidad ciencias informaticas"
    },
    {
      "type": "Videoconferencia",
      "url": "https://conferencia.uci.cu",
      "title": "Servicio de videoconferencias (Jitsi Meet)",
      "searchTags": "videoconferencia jitsi meet reunion virtual conferencia web sala videollamada compartir pantalla chat grabacion streaming transcribir pizarra colaborativa excalidraw encuestas breakout rooms salas grupos invitados privado autoalojado webrtc stun turn xmpp bosh uci universidad ciencias informaticas"
    }
  ]
},
  {
  "id": "cujae",
  "name": "CUJAE (Universidad Tecnológica de La Habana)",
  "logo": "logos/cujae.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://cujae.edu.cu",
      "title": "Portal oficial de la Universidad Tecnológica de La Habana",
      "searchTags": "portal institucional noticias inicio universidad tecnologica habana jose antonio echeverria cujae cuba excelencia ingenieria arquitectura pregrado posgrado doctorados maestrias diplomados investigacion innovacion extension facultades carreras matricula estudiantes profesores campus marianao rankings qs webometrics scimago"
    },
    {
      "type": "Intranet",
      "url": "https://intranet.cujae.edu.cu",
      "title": "Red interna con servicios administrativos y noticias",
      "searchTags": "intranet red interna servicios administrativos noticias comunicacion institucional trabajadores profesores estudiantes campus universitario cujae universidad tecnologica habana"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://moodle.cujae.edu.cu",
      "title": "Aula virtual de pregrado (Moodle)",
      "searchTags": "moodle plataforma teleformacion aula virtual pregrado posgrado cursos asignaturas estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes facultades ingenieria arquitectura civil electrica automatica biomedica telecomunicaciones electronica industrial informatica mecanica quimica hidraulica geofisica metalurgica materiales ciencias basicas educacion fisica deportes recreacion crea centro capacitacion extension universitaria doctorados maestrias cujae universidad tecnologica habana jose antonio echeverria"
    },
    {
      "type": "Sitio Web",
      "url": "https://teleportal.cujae.edu.cu",
      "title": "Portal de la Facultad de Ingeniería en Telecomunicaciones y Electrónica",
      "searchTags": "fite facultad ingenieria telecomunicaciones electronica telematica radio comunicaciones senales transmision recepcion redes microprocesadores sensores tic investigacion posgrado pregrado formacion profesional cujae universidad tecnologica habana jose antonio echeverria marianao"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://repositorio.cujae.edu.cu",
      "title": "Repositorio académico y científico institucional",
      "searchTags": "repositorio institucional cientifico academico dspace tesis diploma maestria doctorado pregrado posgrado investigacion produccion cientifica acceso abierto open access comunidades colecciones cujae instituto superior politecnico jose antonio echeverria universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://renia.cujae.edu.cu",
      "title": "Revista de Ingeniería y Arquitectura (RENIA)",
      "searchTags": "revista cientifica renia ingenieria arquitectura cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistamecanica.cujae.edu.cu",
      "title": "Revista Ingeniería Mecánica",
      "searchTags": "revista cientifica ingenieria mecanica cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistarrancada.cujae.edu.cu",
      "title": "Revista Arrancada - deporte y cultura física",
      "searchTags": "revista cientifica arrancada deporte cultura fisica cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistatelematica.cujae.edu.cu",
      "title": "Revista Telemática - telecomunicaciones e informática",
      "searchTags": "revista cientifica telematica telecomunicaciones informatica cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://rie.cujae.edu.cu",
      "title": "Revista de Ingeniería Electrónica, Automática y Comunicaciones",
      "searchTags": "revista cientifica rie ingenieria electronica automatica comunicaciones cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://rielac.cujae.edu.cu",
      "title": "Revista de Ingeniería Eléctrica y Automática (RIELAC)",
      "searchTags": "revista cientifica rielac ingenieria electrica automatica cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://riha.cujae.edu.cu",
      "title": "Revista de Ingeniería Hidráulica y Ambiental",
      "searchTags": "revista cientifica riha ingenieria hidraulica ambiental cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://rii.cujae.edu.cu",
      "title": "Revista de Ingeniería Industrial",
      "searchTags": "revista cientifica rii ingenieria industrial cujae universidad tecnologica habana"
    },
    {
      "type": "Revista Científica",
      "url": "https://rrp.cujae.edu.cu",
      "title": "Revista Referencia Pedagógica",
      "searchTags": "revista cientifica rrp referencia pedagogica educacion cujae universidad tecnologica habana"
    },
    {
      "type": "Chat",
      "url": "https://smi.cujae.edu.cu",
      "title": "Sistema de mensajería instantánea para la comunidad universitaria",
      "searchTags": "chat mensajeria instantanea comunicacion interna smi colaboracion mensajes comunidad universitaria cujae universidad tecnologica habana"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.cujae.edu.cu",
      "title": "Sistema de gestión académica y secretaría docente",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores cujae universidad tecnologica habana"
    },
    {
      "type": "Nube",
      "url": "https://nube.cujae.edu.cu",
      "title": "Almacenamiento en la nube y colaboración en línea",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion equipo trabajo remoto campus virtual comunidad universitaria cujae universidad tecnologica habana"
    }
  ]
},
  {
  "id": "um",
  "name": "UM (Universidad de Matanzas)",
  "logo": "logos/um.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.umcc.cu",
      "title": "Portal institucional de la Universidad de Matanzas",
      "searchTags": "portal institucional noticias inicio universidad matanzas camilo cienfuegos umcc cuba ciudad saberes pregrado posgrado carreras investigacion innovacion extension facultades centros estudios cebio cefas cened jardin botanico observatorios eventos revistas cientificas atenas pastos forrajes retos turisticos matricula estudiantes profesores campus autopista varadero patrimonio cultural"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://eva.umcc.cu",
      "title": "Entorno virtual de enseñanza-aprendizaje para cursos de pregrado",
      "searchTags": "eva entorno virtual aprendizaje moodle plataforma educativa cursos asignaturas estudiantes profesores matricula clases material didactico drpa departamento recursos aprendizaje umcc universidad matanzas"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://cict.umcc.cu",
      "title": "Repositorio del Centro de Información Científico-Técnica",
      "searchTags": "repositorio cict centro informacion cientifico tecnico biblioteca publicaciones documentos produccion cientifica umcc universidad matanzas"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://rein.umcc.cu",
      "title": "Repositorio Educativo Institucional (objetos de aprendizaje)",
      "searchTags": "repositorio institucional educativo rein dspace tesis doctorado maestria especialidad trabajo diploma pregrado eventos cientificos congresos monografias libros produccion cientifica academica acceso abierto open access comunidades colecciones autores materias turismo gestion empresarial petroleo cultura fisica umcc universidad matanzas"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://abcd.umcc.cu",
      "title": "Catálogo en línea de la Biblioteca Universitaria",
      "searchTags": "biblioteca catalogo abcd libros consulta busqueda bibliografica recurso documental umcc universidad matanzas"
    },
    {
      "type": "Revista Científica",
      "url": "https://retosturisticos.umcc.cu",
      "title": "Revista Retos Turísticos - investigación en turismo",
      "searchTags": "revista cientifica retos turisticos turismo investigacion umcc universidad matanzas"
    },
    {
      "type": "Revista Científica",
      "url": "https://atenas.umcc.cu",
      "title": "Revista Atenas - ciencias de la educación",
      "searchTags": "revista cientifica atenas ciencias educacion pedagogia umcc universidad matanzas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.umcc.cu",
      "title": "Correo institucional para profesores y trabajadores",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos umcc universidad matanzas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correoest.umcc.cu",
      "title": "Servicio de correo electrónico estudiantil",
      "searchTags": "correo electronico estudiantes webmail zimbra email estudiantil login acceso bandeja entrada mensajes buzon correo alumnos umcc universidad matanzas"
    }
  ]
},
  {
  "id": "ucf",
  "name": "UCf (Universidad de Cienfuegos)",
  "logo": "logos/ucf.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.ucf.edu.cu",
      "title": "Portal oficial de la Universidad de Cienfuegos Carlos Rafael Rodríguez",
      "searchTags": "portal institucional noticias inicio universidad cienfuegos carlos rafael rodriguez ucf cuba pregrado posgrado investigacion extension facultades carreras matricula estudiantes profesores servicios correo nube repositorio observatorio cientifico editorial universo sur revista estudiantil convocatorias eventos"
    },
    {
      "type": "Intranet",
      "url": "https://intranet.ucf.edu.cu",
      "title": "Red interna con servicios y comunicaciones institucionales",
      "searchTags": "intranet red interna servicios comunicacion institucional autenticacion sso authentik trabajadores profesores estudiantes campus noticias ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://encuestas.ucf.edu.cu",
      "title": "Sistema de encuestas en línea para investigaciones",
      "searchTags": "encuestas formularios cuestionarios recoleccion datos investigacion opinion academicos institucionales limesurvey sitio web encuestas ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://caipd.ucf.edu.cu",
      "title": "Centro de Atención Integral a Personas con Discapacidad",
      "searchTags": "caipd centro atencion integral personas discapacidad comite academico ingles desarrollo cursos idioma moodle plataforma educativa ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://auth.ucf.edu.cu",
      "title": "Servicio de autenticación centralizada",
      "searchTags": "autenticacion centralizada sso login acceso cuenta identidad gestion usuario contraseña seguridad authentik ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://micuenta.ucf.edu.cu",
      "title": "Gestión de cuenta de usuario y contraseña",
      "searchTags": "cuenta usuario gestion contraseña cambio recuperacion olvidada reset password pwm autoservicio perfil dominio ucf autenticacion identidad acceso login credenciales seguridad"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://eventos.ucf.edu.cu",
      "title": "Plataforma para la organización de eventos científicos",
      "searchTags": "eventos cientificos congresos convenciones talleres jornadas simposios ponencias conferencias seminarios foros indico cern calendario inscripcion programa comite organizador certificacion ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://talleres.ucf.edu.cu",
      "title": "Sistema de gestión de talleres y seminarios",
      "searchTags": "eventos talleres seminarios conferencias capacitacion inscripcion indico calendario ucf universidad cienfuegos"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://clasesvirtuales.ucf.edu.cu",
      "title": "Aula virtual para la docencia de pregrado",
      "searchTags": "moodle clases virtuales aula virtual pregrado cursos asignaturas plataforma educativa login acceso estudiantes profesores matricula material didactico tareas foros cuestionarios examenes ucf universidad cienfuegos"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://postgradosvirtuales.ucf.edu.cu",
      "title": "Plataforma de superación posgraduada a distancia",
      "searchTags": "moodle posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa login registro acceso estudiantes profesores ucf universidad cienfuegos"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://pled.ucf.edu.cu/",
      "title": "Plataforma de Educación a Distancia para posgrado",
      "searchTags": "moodle posgrado educacion distancia pled plataforma virtual superacion cuadros capacitacion cursos ucf universidad cienfuegos"
    },
    {
      "type": "EVEA MOOCs",
      "url": "https://cursos.ucf.edu.cu",
      "title": "Cursos abiertos masivos en línea (MOOC)",
      "searchTags": "moodle cursos abiertos masivos mooc plataforma educativa gratuita autoaprendizaje capacitacion superacion profesional convencion cientifica internacional preevento posdoctoral psicopedagogia ucf universidad cienfuegos"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://dspace.ucf.edu.cu",
      "title": "Repositorio institucional en DSpace de la UCf",
      "searchTags": "repositorio institucional dspace tesis grado maestria doctorado documentos acceso abierto crai direccion informatizacion ucf universidad cienfuegos"
    },
    {
      "type": "Revista Científica",
      "url": "https://rus.ucf.edu.cu",
      "title": "Revista Universidad y Sociedad",
      "searchTags": "revista cientifica universidad sociedad ciencias sociales humanidades ucf universidad cienfuegos"
    },
    {
      "type": "Revista Científica",
      "url": "https://conrado.ucf.edu.cu",
      "title": "Revista Conrado - pedagogía y educación",
      "searchTags": "revista cientifica conrado pedagogia educacion ucf universidad cienfuegos"
    },
    {
      "type": "Revista Científica",
      "url": "https://aes.ucf.edu.cu",
      "title": "Revista Agroecosistemas",
      "searchTags": "revista cientifica agroecosistemas agricultura sostenible medio ambiente ucf universidad cienfuegos"
    },
    {
      "type": "Revista Científica",
      "url": "https://rccd.ucf.edu.cu/",
      "title": "Revista Científica Cultura y Desarrollo",
      "searchTags": "revista cientifica cultura desarrollo patrimonio identidad ucf universidad cienfuegos"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.ucf.edu.cu",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico institucional outlook exchange microsoft owa webmail email login acceso bandeja entrada mensajes buzon profesores trabajadores ucf universidad cienfuegos"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail.ucf.edu.cu",
      "title": "Acceso webmail alternativo para correo UCf",
      "searchTags": "correo electronico webmail sogo acceso alternativo email login pop3 imap smtp configuracion cliente correo ucf universidad cienfuegos"
    },
    {
      "type": "Nube",
      "url": "https://nube.ucf.edu.cu",
      "title": "Sistema de almacenamiento y compartición de archivos en la nube",
      "searchTags": "allspace nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos talk videollamadas onlyoffice documents fotos notas musica circles tables ucf universidad cienfuegos"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.ucf.edu.cu",
      "title": "Sistema de gestión de secretaría docente",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://internet.ucf.edu.cu/",
      "title": "Servicio de acceso a Internet",
      "searchTags": "internet acceso navegacion conectividad proxy red servicio ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://updates.ucf.edu.cu/",
      "title": "Servidor de actualizaciones (WSUS/antivirus)",
      "searchTags": "actualizaciones antivirus software descargas seguridad sistema operativo windows linux ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://red.ucf.edu.cu/",
      "title": "Red universitaria de datos",
      "searchTags": "red universitaria datos conectividad infraestructura telecomunicaciones servicios telematicos ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://history.ucf.edu.cu",
      "title": "Observatorio Social",
      "searchTags": "observatorio social historia investigacion ciencias sociales patrimonio cultural ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://crai.ucf.edu.cu/",
      "title": "Centro de Recursos para el Aprendizaje y la Investigación",
      "searchTags": "crai centro recursos aprendizaje investigacion biblioteca documentacion informacion cientifica ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://observatoriocientifico.ucf.edu.cu/",
      "title": "Observatorio Científico",
      "searchTags": "observatorio cientifico ciencia tecnologia indicadores metricos vigilancia tecnologica investigacion ucf universidad cienfuegos"
    },
    {
      "type": "Sitio Web",
      "url": "https://universosur.ucf.edu.cu/",
      "title": "Editorial Universo Sur",
      "searchTags": "editorial universo sur publicaciones academicas libros revistas cientificas edicion investigacion ucf universidad cienfuegos"
    }
  ]
},
  {
  "id": "uclv",
  "name": "UCLV (Universidad Central \"Marta Abreu\" de Las Villas)",
  "logo": "logos/uclv.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.uclv.edu.cu",
      "title": "Portal oficial de la Universidad Central de Las Villas",
      "searchTags": "portal institucional noticias inicio universidad central marta abreu las villas uclv santa clara cuba pregrado posgrado ciencia innovacion extension internacionalizacion rankings qs caribe latinoamerica rector vicerrectores consejo direccion carreras matricula estudiantes profesores campus villaclareño servicios correo moodle nube cuentas sigenu dspace cdict biblioteca libros radio transporte comedor software antivirus tecnologia educativa sipac redes convencion cientifica internacional festival universitario juegos criollos sociedad interfaz"
    },
    {
      "type": "Sitio Web",
      "url": "https://cti.uclv.edu.cu",
      "title": "Centro de Tecnologías de la Información",
      "searchTags": "cti centro tecnologias informacion ciencia tecnologia innovacion balance anual trabajo cientifico tecnologico autoevaluacion dependencias universitarias facultades centros investigacion mes uclv universidad central las villas"
    },
    {
      "type": "Sitio Web",
      "url": "http://feijoo.cdict.uclv.edu.cu",
      "title": "Sitio de la cátedra Feijoo de estudios literarios",
      "searchTags": "catedra feijoo estudios literarios literatura critica editorial publicaciones investigacion humanidades uclv universidad central marta abreu las villas"
    },
    {
      "type": "Sitio Web",
      "url": "https://teletrabajo.uclv.edu.cu",
      "title": "Portal de apoyo al teletrabajo y educación a distancia",
      "searchTags": "teletrabajo trabajo remoto educacion distancia apoyo virtual campus digital herramientas colaboracion videoconferencias recursos educativos uclv universidad central marta abreu las villas"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://convencion.uclv.edu.cu",
      "title": "Convención Científica Internacional de la UCLV",
      "searchTags": "convencion cientifica internacional congreso conferencias ponencias talleres simposios investigacion ciencia tecnologia innovacion intercambio academico uclv universidad central marta abreu las villas"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://moodle.uclv.edu.cu",
      "title": "Aula virtual Moodle para el pregrado",
      "searchTags": "moodle campus virtual aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes facultades ciencias agropecuarias economicas sociales construcciones cultura fisica educacion infantil media humanidades ingenieria electrica industrial mecanica matematica fisica computacion quimica farmacia cums dte direccion tecnologia educativa videos educativos h5p uclv universidad central marta abreu las villas santa clara"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://aula.uclv.edu.cu",
      "title": "Entorno virtual para cursos de posgrado",
      "searchTags": "moodle evisa entorno virtual superacion academica posgrado cursos institucionales entrenamientos diplomados estudios distancia escuela internacional posgrados eventos plataforma educativa dte direccion tecnologia educativa videos educativos h5p profesores estudiantes investigadores uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://dspace.uclv.edu.cu",
      "title": "Repositorio académico y de tesis de la UCLV",
      "searchTags": "repositorio dspace academico cientifico tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones produccion cientifica acceso abierto open access comunidades colecciones uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio de Libros",
      "url": "https://libros.uclv.edu.cu",
      "title": "Biblioteca digital de libros académicos",
      "searchTags": "biblioteca digital libros electronicos academicos compartir descargas contribuciones intercambio campus universitario uclv direccion informatizacion comunicaciones ebook pdf texto completo uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio de Libros",
      "url": "https://elibros.uclv.edu.cu",
      "title": "Plataforma de libros electrónicos de la editorial Feijóo",
      "searchTags": "biblioteca digital libros electronicos elibros editorial feijoo buscador navegar categorias series autores editores idiomas calificaciones formatos epub pdf descargas lectura uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio de aplicaciones",
      "url": "https://soft.uclv.edu.cu",
      "title": "Repositorio de software libre y aplicaciones institucionales",
      "searchTags": "software aplicaciones descargas programas utilidades herramientas sistemas operativos linux ubuntu debian fedora centos desarrollo visual studio code gitlab python java antivirus eset diseño autocad blender ofimatica libreoffice servidores zimbra docker nextcloud ftp repositorio red local uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio de código",
      "url": "https://repos.uclv.edu.cu",
      "title": "Servidor Git para alojamiento de código fuente",
      "searchTags": "git repositorio codigo fuente desarrollo colaborativo software control versiones forja programacion proyectos uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio Linux",
      "url": "https://repo.uclv.edu.cu",
      "title": "Repositorio local de paquetes para distribuciones Linux",
      "searchTags": "repositorio paquetes linux mirror local ubuntu debian rockylinux almalinux archlinux mint fedora epel docker proxmox openwrt mellanox percona elastic actualizaciones descargas campus uclv universidad central marta abreu las villas"
    },
    {
      "type": "Repositorio de Antivirus",
      "url": "https://antivirus.uclv.edu.cu",
      "title": "Repositorio de actualizaciones de antivirus para la red",
      "searchTags": "antivirus actualizaciones seguridad virus proteccion kaspersky nod32 avast avg avira bitdefender clamav segurmatica windows defender pfsense descargas red campus uclv universidad central marta abreu las villas"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://bida.uclv.edu.cu",
      "title": "Biblioteca Digital de la UCLV",
      "searchTags": "biblioteca digital bida dspace documentos cientificos libros articulos tesis doctorales investigacion docencia ciencias sociales salud vida tierra fisica matematicas humanidades literatura artes ingenierias computacion negocios economia administracion normas cubanas quimica materiales acceso abierto comunidades colecciones uclv universidad central marta abreu las villas"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "http://www.cdict.uclv.edu.cu",
      "title": "Centro de Documentación e Información Científico-Técnica",
      "searchTags": "dict direccion informacion cientifico tecnica centro documentacion biblioteca catalogo coleccion coronado abcd bida dspace repositorio digital editorial feijoo solicited gestion espacios docentes referencia virtual normas catalogacion dewey formacion usuarios laboratorios uclv universidad central marta abreu las villas santa clara"
    },
    {
      "type": "Revista Científica",
      "url": "https://islas.uclv.edu.cu",
      "title": "Revista Islas - humanidades y ciencias sociales",
      "searchTags": "revista cientifica islas humanidades ciencias sociales literatura filosofia historia arte cultura uclv universidad central marta abreu las villas"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistavarela.uclv.edu.cu",
      "title": "Revista Varela - pedagogía y educación",
      "searchTags": "revista cientifica varela pedagogia educacion didactica formacion docente ensenanza aprendizaje uclv universidad central marta abreu las villas"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistaciaf.uclv.edu.cu",
      "title": "Revista Ciencia y Actividad Física",
      "searchTags": "revista cientifica ciencia actividad fisica deporte cultura fisica entrenamiento deportivo educacion fisica uclv universidad central marta abreu las villas"
    },
    {
      "type": "Revista Científica",
      "url": "https://centroazucar.uclv.edu.cu",
      "title": "Revista Centro Azúcar - industria azucarera y biotecnología",
      "searchTags": "revista cientifica centro azucar industria azucarera biotecnologia cana azucar derivados agroindustria uclv universidad central marta abreu las villas"
    },
    {
      "type": "Revista Científica",
      "url": "https://cagricola.uclv.edu.cu",
      "title": "Revista Centro Agrícola",
      "searchTags": "revista cientifica centro agricola agricultura agropecuaria cultivos suelos agronomia uclv universidad central marta abreu las villas"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.uclv.edu.cu",
      "title": "Sistema de Gestión Universitaria de la UCLV",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores uclv universidad central marta abreu las villas"
    }
  ]
},
  {
  "id": "uniss",
  "name": "UNISS (Universidad de Sancti Spíritus \"José Martí Pérez\")",
  "logo": "logos/uniss.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.uniss.edu.cu",
      "title": "Portal institucional de la Universidad de Sancti Spíritus",
      "searchTags": "portal institucional noticias inicio universidad sancti spiritus jose marti perez uniss certificada excelencia pregrado posgrado carreras universitarias facultades ciencias pedagogicas ciencias tecnicas economicas cultura fisica ciencias agropecuarias humanidades centros estudio cecess ceepi cetad educacion energia procesos industriales direccion revistas cientificas margenes pedagogia sociedad repositorio cientifico investigacion proyectos internacionales convenios internacionales idiomas cum cabaiguan fomento yaguajay taguasco la sierpe trinidad graduados nacionales extranjeros requisitos ingreso plataformas interactivas aprendizaje contacto"
    },
    {
      "type": "Gestión de cuenta",
      "url": "https://cambio.uniss.edu.cu",
      "title": "Portal de cambio de contraseña de Moodle y servicios institucionales",
      "searchTags": "cambio recuperacion contraseña password reset olvido expiro acceso cuenta usuario login seguridad autenticacion ldap credenciales uniss sancti spiritus"
    },
    {
      "type": "Sitio Web",
      "url": "https://encuestas.uniss.edu.cu",
      "title": "Sistema para la creación y gestión de encuestas",
      "searchTags": "encuestas formularios cuestionarios investigacion opinion recoleccion datos academicos institucionales limesurvey sitio web encuestas uniss sancti spiritus"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://eventos.uniss.edu.cu",
      "title": "Plataforma para la organización de eventos científicos",
      "searchTags": "eventos congresos convenciones talleres jornadas simposios ponencias inscripcion cientificos academicos conferencias seminarios uniss sancti spiritus"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://pregrado.uniss.edu.cu",
      "title": "Aula virtual para cursos de grado",
      "searchTags": "moodle aula virtual pregrado uniss sancti spiritus plataforma interactiva aprendizaje cursos asignaturas facultades ciencias agropecuarias ciencias pedagogicas ciencias tecnicas economicas cultura fisica humanidades departamento historia marxismo leninismo preparacion defensa centro idiomas catedras honorificas estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://posgrado.uniss.edu.cu",
      "title": "Entorno virtual de enseñanza para formación posgraduada",
      "searchTags": "moodle aula virtual posgrado uniss sancti spiritus plataforma interactiva aprendizaje superacion profesional cursos posgrado maestrias doctorados especialidad psicopedagogia docencia calendario eventos academicos estudiantes profesores investigadores matricula clases material didactico tareas foros cuestionarios examenes"
    },
    {
      "type": "EVEA EaD",
      "url": "https://mooc.uniss.edu.cu",
      "title": "Plataforma de cursos abiertos y educación a distancia",
      "searchTags": "moodle aula virtual uniss sancti spiritus plataforma aprendizaje en linea mooc cursos abiertos carreras educacion distancia maestrias distancia aprendizaje online estudiar cualquier momento cualquier lugar ordenador portatil tablet telefono movil autoaprendizaje matricula gratuita"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://dspace.uniss.edu.cu",
      "title": "Repositorio académico y científico institucional",
      "searchTags": "repositorio institucional dspace uniss sancti spiritus jose marti perez produccion cientifica tesis doctorado tesis maestria tesis pregrado trabajo diploma articulos libros publicaciones academicas acceso abierto comunidades colecciones facultad ciencias agropecuarias facultad cultura fisica deporte facultad ciencias pedagogicas facultad ciencias tecnicas empresariales facultad humanidades centro estudios educacion ciencias energia procesos industriales tecnicas avanzadas direccion revistas uniss margenes pedagogia sociedad"
    },
    {
      "type": "Repositorio - Tesis de Doctorado",
      "url": "https://dspace.uniss.edu.cu/handle/123456789/797",
      "title": "Tesis doctorales de la UNISS",
      "searchTags": "tesis doctorado phd investigacion doctoral uniss sancti spiritus repositorio dspace"
    },
    {
      "type": "Repositorio - Tesis de Maestría",
      "url": "https://dspace.uniss.edu.cu/handle/123456789/9550",
      "title": "Tesis de maestría de la UNISS",
      "searchTags": "tesis maestria posgrado investigacion uniss sancti spiritus repositorio dspace"
    },
    {
      "type": "Repositorio - Tesis de Pregrado",
      "url": "https://dspace.uniss.edu.cu/handle/123456789/9420",
      "title": "Tesis de pregrado (licenciatura e ingeniería) de la UNISS",
      "searchTags": "tesis pregrado trabajo diploma licenciatura ingenieria uniss sancti spiritus repositorio dspace"
    },
    {
      "type": "Repositorio de aplicaciones",
      "url": "https://software.uniss.edu.cu",
      "title": "Repositorio de programas y aplicaciones informáticas",
      "searchTags": "ftp servidor archivos descargas software aplicaciones programas utilidades herramientas informaticas antivirus bibliografia documentacion comunicacion informatizacion flisol media tecnicos kms adminer base datos repositorio archivos compartidos uniss sancti spiritus"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://desiderionavarro.uniss.edu.cu",
      "title": "Biblioteca Provincial Desiderio Navarro",
      "searchTags": "catedra honorifica desiderio navarro biblioteca investigacion promocion cultural cultura cubana literatura artes plasticas estetica culturologia critica traduccion teoria literaria semiotica sociologia praxis social marxismo publicaciones cientificas jornada cientifica internacional educacion linguo literaria uniss sancti spiritus jose marti perez"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.uniss.edu.cu/index.php/margenes",
      "title": "Revista Márgenes - Publicación científica de la UNISS",
      "searchTags": "revista margenes articulo cientifico publicacion investigacion multidisciplinaria humanidades ciencias sociales educacion cultura uniss sancti spiritus pdf ojs"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.uniss.edu.cu/index.php/pedagogia-y-sociedad",
      "title": "Revista Pedagogía y Sociedad - Ciencias de la educación de la UNISS",
      "searchTags": "revista pedagogia sociedad articulo cientifico educacion didactica pedagogia ciencias educacion investigacion educativa uniss sancti spiritus pdf ojs"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.uniss.edu.cu",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico webmail roundcube email institucional login acceso bandeja entrada mensajes buzón correo profesores trabajadores administrativos uniss sancti spiritus"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.uniss.edu.cu",
      "title": "Sistema de gestión de la secretaría general",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores uniss sancti spiritus"
    }
  ]
},
 {
  "id": "unica",
  "name": "UNICA (Universidad de Ciego de Ávila)",
  "logo": "logos/unica.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.unica.cu",
      "title": "Portal oficial de la Universidad de Ciego de Ávila",
      "searchTags": "portal institucional noticias inicio universidad ciego avila unica maximo gomez cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus avileño"
    },
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.reduc.edu.cu",
      "title": "Portal de la Red Universitaria de Ciego de Ávila y Camagüey",
      "searchTags": "portal red universitaria ciego avila camagüey reduc cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores"
    },
    {
      "type": "Intranet",
      "url": "https://intranet.unica.cu",
      "title": "Red interna de servicios y comunicación institucional",
      "searchTags": "intranet red interna servicios comunicacion institucional trabajadores profesores estudiantes campus noticias avisos unica universidad ciego avila"
    },
    {
      "type": "Sitio Web",
      "url": "https://tunota.unica.cu/",
      "title": "Sistema de consulta de notas académicas",
      "searchTags": "notas academicas calificaciones consulta expediente estudiante historial academico resultados docentes evaluaciones unica universidad ciego avila"
    },
    {
      "type": "Sitio Web",
      "url": "https://unilegal.unica.cu/",
      "title": "Asesoría jurídica y documentos normativos",
      "searchTags": "asesoria juridica documentos normativos leyes decretos resoluciones reglamentos consulta legal normativa institucional unica universidad ciego avila"
    },
    {
      "type": "Sitio Web",
      "url": "https://tickets.unica.cu/",
      "title": "Sistema de mesa de ayuda y soporte técnico",
      "searchTags": "tickets mesa ayuda soporte tecnico incidencias reportes asistencia tecnica servicios informaticos mantenimiento reparacion unica universidad ciego avila"
    },
    {
      "type": "Sitio Web",
      "url": "https://tickets.sma.unica.cu/",
      "title": "Gestión de incidencias de servicios informáticos",
      "searchTags": "tickets incidencias servicios informaticos soporte tecnico reportes fallos averias asistencia sma mantenimiento unica universidad ciego avila"
    },
    {
      "type": "Sitio Web",
      "url": "https://encuestas.reduc.edu.cu",
      "title": "Plataforma de encuestas en línea para la red universitaria",
      "searchTags": "encuestas formularios cuestionarios investigacion opinion recoleccion datos limesurvey reduc unica universidad ciego avila"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://pregrado.unica.cu",
      "title": "Aula virtual de pregrado (Moodle)",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes unica universidad ciego avila"
    },
    {
      "type": "EVEA de Pregrado",
      "url": "https://moodle.reduc.edu.cu",
      "title": "Moodle central para cursos de grado (REDUC)",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes reduc unica universidad ciego avila"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://posgrado.unica.cu",
      "title": "Entorno virtual para la superación posgraduada",
      "searchTags": "moodle posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa estudiantes profesores unica universidad ciego avila"
    },
    {
      "type": "EVEA de Posgrado",
      "url": "https://moodlepost.reduc.edu.cu",
      "title": "Moodle para posgrado y maestrías (REDUC)",
      "searchTags": "moodle postgrado posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa reduc unica universidad ciego avila"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://dspace.unica.cu",
      "title": "Repositorio científico institucional de la UNICA",
      "searchTags": "repositorio cientifico institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones academicas produccion cientifica acceso abierto open access unica universidad ciego avila"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://rediuc.reduc.edu.cu",
      "title": "Repositorio Digital de la Red Universitaria",
      "searchTags": "repositorio digital rediuc dspace tesis doctorado maestria pregrado trabajo diploma articulos publicaciones academicas produccion cientifica acceso abierto open access reduc unica universidad ciego avila"
    },
    {
      "type": "Repositorio de código",
      "url": "https://gitlab.reduc.edu.cu",
      "title": "Plataforma GitLab para desarrollo de software y proyectos",
      "searchTags": "gitlab forja repositorio codigo fuente desarrollo colaborativo software control versiones git merge request integracion continua ci cd proyecto programacion devops reduc unica universidad ciego avila"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://bivi.reduc.edu.cu",
      "title": "Biblioteca Virtual de la REDUC",
      "searchTags": "biblioteca virtual bivi libros consulta busqueda bibliografica recurso documental catalogo digital repositorio documental reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.unica.cu/index.php/uciencia",
      "title": "Revista Universidad y Ciencia",
      "searchTags": "revista cientifica universidad ciencia multidisciplinaria articulos investigacion academicos publicacion cientifica unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.unica.cu/index.php/edusoc",
      "title": "Revista Educación y Sociedad",
      "searchTags": "revista cientifica educacion sociedad pedagogia didactica formacion docente ensenanza aprendizaje ciencias educacion sociales unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.unica.cu/index.php/regu",
      "title": "Revista Estrategia y Gestión Universitaria",
      "searchTags": "revista cientifica estrategia gestion universitaria administracion educacion superior direccion planificacion calidad unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.reduc.edu.cu",
      "title": "Portal unificado de revistas científicas de la REDUC",
      "searchTags": "portal revistas cientificas publicaciones academicas articulos investigacion ojs acceso abierto open access reduc unica universidad ciego avila camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://cienciaydeporte.reduc.edu.cu",
      "title": "Revista Ciencia y Deporte",
      "searchTags": "revista cientifica ciencia deporte cultura fisica actividad fisica entrenamiento deportivo educacion fisica reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://agrisost.reduc.edu.cu",
      "title": "Revista Agrisost - agricultura sostenible",
      "searchTags": "revista cientifica agrisost agricultura sostenible agropecuaria medio ambiente desarrollo rural sostenibilidad reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://monteverdia.reduc.edu.cu",
      "title": "Revista Monteverdia - medio ambiente",
      "searchTags": "revista cientifica monteverdia medio ambiente ecologia conservacion biodiversidad recursos naturales desarrollo sostenible reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://transformacion.reduc.edu.cu",
      "title": "Revista Transformación - ciencias de la educación",
      "searchTags": "revista cientifica transformacion educacion pedagogia didactica formacion docente ensenanza aprendizaje ciencias educacion reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://retos.reduc.edu.cu",
      "title": "Revista Retos de la Administración",
      "searchTags": "revista cientifica retos administracion direccion gestion empresarial economia administracion empresas liderazgo reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://arcada.reduc.edu.cu",
      "title": "Revista Arcada - conservación del patrimonio",
      "searchTags": "revista cientifica arcada patrimonio cultural conservacion historia arquitectura restauracion identidad cultura reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://rpa.reduc.edu.cu",
      "title": "Revista de Producción Animal",
      "searchTags": "revista cientifica produccion animal ganaderia veterinaria zootecnia pastos forrajes nutricion animal reproduccion reduc unica universidad ciego avila"
    },
    {
      "type": "Revista Científica",
      "url": "https://perspectiva.reduc.edu.cu",
      "title": "Revista Perspectiva - ciencias sociales",
      "searchTags": "revista cientifica perspectiva ciencias sociales humanidades sociologia filosofia historia psicologia comunicacion social reduc unica universidad ciego avila"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.unica.cu",
      "title": "Servicio de correo institucional de la UNICA",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos unica universidad ciego avila"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.reduc.edu.cu",
      "title": "Correo electrónico para usuarios de la REDUC",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo reduc unica universidad ciego avila"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail.reduc.edu.cu",
      "title": "Acceso webmail al correo REDUC (opción 1)",
      "searchTags": "correo electronico webmail acceso alternativo email login bandeja entrada mensajes buzon reduc unica universidad ciego avila"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail1.reduc.edu.cu",
      "title": "Acceso webmail al correo REDUC (opción 2)",
      "searchTags": "correo electronico webmail acceso alternativo email login bandeja entrada mensajes buzon reduc unica universidad ciego avila"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.unica.cu",
      "title": "Sistema de gestión de matrícula y expedientes",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores unica universidad ciego avila"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.reduc.edu.cu",
      "title": "SIGENU centralizado de la REDUC",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico reduc unica universidad ciego avila"
    },
    {
      "type": "Nube",
      "url": "https://nube.unica.cu",
      "title": "Almacenamiento en la nube para la comunidad universitaria",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion unica universidad ciego avila"
    },
    {
      "type": "Nube",
      "url": "https://nube.reduc.edu.cu",
      "title": "Nube colaborativa de la REDUC",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion reduc unica universidad ciego avila"
    }
  ]
},
  {
  "id": "uc",
  "name": "UC (Universidad de Camagüey)",
  "logo": "logos/uc.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.reduc.edu.cu",
      "title": "Portal institucional de la Universidad de Camagüey (REDUC)",
      "searchTags": "portal institucional noticias inicio universidad camagüey ignacio agramonte loynaz reduc cuba red universitaria pregrado posgrado carreras investigacion innovacion extension facultades ciencias agropecuarias aplicadas economicas juridicas pedagogicas lenguas comunicacion construcciones cultura fisica electromecanica sociales informatica exactas centros estudios revistas cientificas convencion internacional eventos aplicaciones moviles"
    },
    {
      "type": "Sitio Web",
      "url": "https://encuestas.reduc.edu.cu",
      "title": "Herramienta de encuestas y formularios en línea",
      "searchTags": "encuestas formularios cuestionarios investigacion opinion recoleccion datos limesurvey reduc universidad camagüey"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://moodle.reduc.edu.cu",
      "title": "Aula virtual para la enseñanza de grado",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes reduc universidad camagüey"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://moodlepost.reduc.edu.cu",
      "title": "Plataforma de educación posgraduada virtual",
      "searchTags": "moodle postgrado posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa centro virtual estudiantes profesores reduc universidad camagüey"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://rediuc.reduc.edu.cu",
      "title": "Repositorio Digital Institucional de la UC",
      "searchTags": "repositorio digital institucional rediuc dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones academicas cientificas produccion cientifica acceso abierto open access comunidades colecciones reduc universidad camagüey"
    },
    {
      "type": "Repositorio de código",
      "url": "https://gitlab.reduc.edu.cu",
      "title": "Forja institucional para alojamiento de repositorios Git",
      "searchTags": "gitlab forja repositorio codigo fuente desarrollo colaborativo software control versiones git merge request integracion continua ci cd proyecto programacion devops reduc universidad camagüey"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://bivi.reduc.edu.cu",
      "title": "Biblioteca Virtual Universitaria",
      "searchTags": "biblioteca virtual bivi libros consulta busqueda bibliografica recurso documental catalogo digital repositorio documental reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.reduc.edu.cu",
      "title": "Portal general de revistas científicas",
      "searchTags": "portal revistas cientificas publicaciones academicas articulos investigacion ojs acceso abierto open access retos direccion produccion animal arcada transformacion agrisost ciencia deporte reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://cienciaydeporte.reduc.edu.cu",
      "title": "Revista Ciencia y Deporte",
      "searchTags": "revista cientifica ciencia deporte cultura fisica actividad fisica entrenamiento deportivo educacion fisica reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://agrisost.reduc.edu.cu",
      "title": "Revista Agrisost - agricultura sostenible",
      "searchTags": "revista cientifica agrisost agricultura sostenible agropecuaria medio ambiente desarrollo rural sostenibilidad reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://monteverdia.reduc.edu.cu",
      "title": "Revista Monteverdia - medio ambiente",
      "searchTags": "revista cientifica monteverdia medio ambiente ecologia conservacion biodiversidad recursos naturales desarrollo sostenible reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://transformacion.reduc.edu.cu",
      "title": "Revista Transformación - educación",
      "searchTags": "revista cientifica transformacion educacion pedagogia didactica formacion docente ensenanza aprendizaje ciencias educacion reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://retos.reduc.edu.cu",
      "title": "Revista Retos de la Administración",
      "searchTags": "revista cientifica retos administracion direccion gestion empresarial economia administracion empresas liderazgo reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://arcada.reduc.edu.cu",
      "title": "Revista Arcada - patrimonio cultural",
      "searchTags": "revista cientifica arcada patrimonio cultural conservacion historia arquitectura restauracion identidad cultura reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://rpa.reduc.edu.cu",
      "title": "Revista de Producción Animal",
      "searchTags": "revista cientifica produccion animal ganaderia veterinaria zootecnia pastos forrajes nutricion animal reproduccion reduc universidad camagüey"
    },
    {
      "type": "Revista Científica",
      "url": "https://perspectiva.reduc.edu.cu",
      "title": "Revista Perspectiva - ciencias sociales",
      "searchTags": "revista cientifica perspectiva ciencias sociales humanidades sociologia filosofia historia psicologia comunicacion social reduc universidad camagüey"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.reduc.edu.cu",
      "title": "Servicio de correo electrónico principal",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos reduc universidad camagüey"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail.reduc.edu.cu",
      "title": "Acceso al correo vía web (servidor 1)",
      "searchTags": "correo electronico webmail acceso alternativo email login bandeja entrada mensajes buzon reduc universidad camagüey"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail1.reduc.edu.cu",
      "title": "Acceso al correo vía web (servidor 2)",
      "searchTags": "correo electronico webmail acceso alternativo email login bandeja entrada mensajes buzon reduc universidad camagüey"
    },
    {
      "type": "SIGENU",
      "url": "https://sigenu.reduc.edu.cu",
      "title": "Sistema de gestión de estudiantes y planes de estudio",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores reduc universidad camagüey"
    },
    {
      "type": "Nube",
      "url": "https://nube.reduc.edu.cu",
      "title": "Servicio de nube privada para almacenamiento y colaboración",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion reduc universidad camagüey"
    }
  ]
},
  {
  "id": "ult",
  "name": "ULT (Universidad de Las Tunas)",
  "logo": "logos/ult.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.ult.edu.cu",
      "title": "Portal oficial de la Universidad de Las Tunas",
      "searchTags": "portal institucional noticias inicio universidad las tunas ult vladimir ilich lenin cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus tunero"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://pregrado.ult.edu.cu",
      "title": "Plataforma de cursos virtuales para pregrado",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes ult universidad las tunas"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://uvp.ult.edu.cu",
      "title": "Universidad Virtual de Posgrado",
      "searchTags": "moodle uvp universidad virtual posgrado superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa estudiantes profesores investigadores ult universidad las tunas"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://roa.ult.edu.cu",
      "title": "Repositorio de Objetos de Aprendizaje",
      "searchTags": "repositorio roa objetos aprendizaje recursos educativos digitales contenidos didacticos material docente tesis trabajos diploma articulos produccion cientifica acceso abierto ult universidad las tunas"
    },
    {
      "type": "Repositorio de Videos",
      "url": "https://media.ult.edu.cu",
      "title": "Videoteca universitaria con recursos educativos multimedia",
      "searchTags": "videoteca videos educativos multimedia recursos audiovisuales conferencias clases grabadas tutoriales documentales repositorio multimedia ult universidad las tunas"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://biblioteca.ult.edu.cu",
      "title": "Portal de la biblioteca y sus servicios en línea",
      "searchTags": "biblioteca universitaria catalogo libros consulta busqueda bibliografica recurso documental prestamo sala lectura servicios linea ult universidad las tunas"
    },
    {
      "type": "Revista Científica",
      "url": "https://opuntiabrava.ult.edu.cu",
      "title": "Revista Opuntia Brava - ciencias sociales y humanísticas",
      "searchTags": "revista cientifica opuntia brava ciencias sociales humanisticas humanidades sociologia filosofia historia psicologia pedagogia ult universidad las tunas"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.ult.edu.cu",
      "title": "Sitio de gestión editorial de revistas de la ULT",
      "searchTags": "portal revistas cientificas gestion editorial publicaciones academicas articulos investigacion ojs acceso abierto open access ult universidad las tunas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.ult.edu.cu",
      "title": "Correo electrónico para profesores y personal",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos ult universidad las tunas"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correoest.ult.edu.cu",
      "title": "Servicio de correo electrónico para estudiantes",
      "searchTags": "correo electronico estudiantes webmail zimbra email estudiantil login acceso bandeja entrada mensajes buzon correo alumnos universitario ult universidad las tunas"
    },
    {
      "type": "Nube",
      "url": "https://nube.ult.edu.cu",
      "title": "Sistema de almacenamiento en la nube institucional",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion ult universidad las tunas"
    }
  ]
},
  {
  "id": "uho",
  "name": "UHo (Universidad de Holguín)",
  "logo": "logos/uho.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.uho.edu.cu",
      "title": "Portal principal de la Universidad de Holguín",
      "searchTags": "portal institucional noticias inicio universidad holguin uho oscar lucero cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus holguinero"
    },
    {
      "type": "Sitio Web",
      "url": "https://educa.uho.edu.cu",
      "title": "Portal educativo con recursos didácticos",
      "searchTags": "portal educativo recursos didacticos materiales docentes contenidos educativos guias tutoriales apoyo docencia aprendizaje uho universidad holguin"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://eduvirtual.uho.edu.cu",
      "title": "Educación Virtual - plataforma Moodle para pregrado",
      "searchTags": "moodle educacion virtual aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes uho universidad holguin"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://aulasvirtuales.uho.edu.cu",
      "title": "Aulas virtuales complementarias para cursos regulares",
      "searchTags": "moodle aulas virtuales complementarias pregrado cursos regulares asignaturas plataforma educativa estudiantes profesores matricula clases material didactico uho universidad holguin"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://eadvirtual.uho.edu.cu",
      "title": "Educación a Distancia Virtual para posgrado",
      "searchTags": "moodle educacion distancia virtual posgrado superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa estudiantes profesores uho universidad holguin"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://repositorio.uho.edu.cu",
      "title": "Repositorio académico y de investigación",
      "searchTags": "repositorio academico investigacion dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones produccion cientifica acceso abierto open access uho universidad holguin"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "https://redbibliotecas.uho.edu.cu",
      "title": "Red de bibliotecas universitarias de Holguín",
      "searchTags": "red bibliotecas universitarias catalogo libros consulta busqueda bibliografica recurso documental prestamo servicios bibliotecarios uho universidad holguin"
    },
    {
      "type": "Revista Científica",
      "url": "https://deporvida.uho.edu.cu",
      "title": "Revista DeporVida - cultura física y deporte",
      "searchTags": "revista cientifica deporvida cultura fisica deporte actividad fisica entrenamiento deportivo educacion fisica recreacion uho universidad holguin"
    },
    {
      "type": "Revista Científica",
      "url": "https://luz.uho.edu.cu",
      "title": "Revista Luz - ciencias de la educación",
      "searchTags": "revista cientifica luz ciencias educacion pedagogia didactica formacion docente ensenanza aprendizaje investigacion educativa uho universidad holguin"
    },
    {
      "type": "Revista Científica",
      "url": "https://tecedu.uho.edu.cu",
      "title": "Revista Tecnología Educativa",
      "searchTags": "revista cientifica tecedu tecnologia educativa tic educacion entornos virtuales aprendizaje digital innovacion educativa uho universidad holguin"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.uho.edu.cu",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores estudiantes uho universidad holguin"
    }
  ]
},
  {
  "id": "umoa",
  "name": "UMoa (Universidad de Moa)",
  "logo": "logos/umoa.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.ismm.edu.cu",
      "title": "Portal oficial de la Universidad de Moa Dr. Antonio Núñez Jiménez",
      "searchTags": "portal institucional noticias inicio universidad moa antonio nuñez jimenez ismm holguin cuba pregrado posgrado carreras ingenieria geologia mineria metalurgia investigacion innovacion extension facultades matricula estudiantes profesores campus"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://moodle.ismm.edu.cu",
      "title": "Aula virtual para cursos de grado",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes ismm universidad moa"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://moodle-postgrado.ismm.edu.cu",
      "title": "Entorno virtual de aprendizaje para posgrado",
      "searchTags": "moodle posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa estudiantes profesores ismm universidad moa"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://ninive.ismm.edu.cu",
      "title": "Repositorio Ninive - producción científica institucional",
      "searchTags": "repositorio ninive cientifico institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones academicas produccion cientifica acceso abierto open access geologia mineria metalurgia ismm universidad moa"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://cep.ismm.edu.cu",
      "title": "Centro de Estudios Pedagógicos - repositorio educativo",
      "searchTags": "repositorio educativo centro estudios pedagogicos cep documentos academicos objetos aprendizaje investigacion educativa formacion docente ismm universidad moa"
    },
    {
      "type": "Revista Científica",
      "url": "https://revista.ismm.edu.cu",
      "title": "Revista Ciencia & Futuro - minería y metalurgia",
      "searchTags": "revista cientifica ciencia futuro mineria metalurgia geologia ingenieria industrial medio ambiente desarrollo sostenible ismm universidad moa"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.cujae.edu.cu",
      "title": "Servicio de correo electrónico (compartido con CUJAE)",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores estudiantes ismm universidad moa cujae"
    }
  ]
},
  {
  "id": "udg",
  "name": "UDG (Universidad de Granma)",
  "logo": "logos/udg.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.udg.co.cu",
      "title": "Portal institucional de la Universidad de Granma",
      "searchTags": "portal institucional noticias inicio universidad granma udg blas roca cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus granmense bayamo"
    },
    {
      "type": "Sitio Web",
      "url": "https://passwd.udg.co.cu",
      "title": "Gestión de contraseñas y cuentas de usuario",
      "searchTags": "gestion contraseñas cambio recuperacion password reset pwm autoservicio cuentas usuario perfil dominio acceso login credenciales seguridad udg universidad granma"
    },
    {
      "type": "Sitio Web",
      "url": "https://poblacion.udg.co.cu",
      "title": "Sistema de información de población y estadísticas",
      "searchTags": "sistema informacion poblacion estadisticas datos demograficos censo recursos humanos estudiantes trabajadores indicadores metricas udg universidad granma"
    },
    {
      "type": "Sitio Web",
      "url": "https://gestion.udg.co.cu",
      "title": "Plataforma de gestión administrativa y trámites",
      "searchTags": "gestion administrativa tramites plataforma solicitudes servicios internos recursos humanos finanzas logistica control interno udg universidad granma"
    },
    {
      "type": "Sitio Web",
      "url": "https://ediciones.udg.co.cu",
      "title": "Editorial Universitaria de Granma",
      "searchTags": "editorial universitaria granma ediciones publicaciones academicas libros revistas produccion cientifica difusion conocimiento udg universidad granma"
    },
    {
      "type": "Sitio Web",
      "url": "https://office.udg.co.cu",
      "title": "Acceso a suite ofimática en línea",
      "searchTags": "ofimatica office suite documentos colaboracion en linea procesador texto hojas calculo presentaciones correo calendario udg universidad granma"
    },
    {
      "type": "Sitio Web Eventos",
      "url": "https://congresodesarrollolocal.udg.co.cu",
      "title": "Congreso de Desarrollo Local",
      "searchTags": "congreso desarrollo local eventos cientificos academicos conferencias ponencias talleres investigacion comunidad territorio sostenibilidad emprendimiento udg universidad granma"
    },
    {
      "type": "EVEA EaD",
      "url": "https://eddist.udg.co.cu",
      "title": "Educación a Distancia - plataforma principal",
      "searchTags": "moodle educacion distancia eddist plataforma principal virtual aula cursos asignaturas estudiantes profesores matricula clases material didactico tareas foros udg universidad granma"
    },
    {
      "type": "EVEA EaD",
      "url": "https://moodle.udg.co.cu",
      "title": "Moodle de la Universidad de Granma",
      "searchTags": "moodle aula virtual pregrado posgrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes udg universidad granma"
    },
    {
      "type": "EVEA EaD",
      "url": "https://mooc.udg.co.cu",
      "title": "Plataforma de cursos MOOC",
      "searchTags": "moodle mooc cursos abiertos masivos en linea plataforma educativa gratuita autoaprendizaje certificacion capacitacion superacion profesional udg universidad granma"
    },
    {
      "type": "EVEA EaD",
      "url": "https://eva.udg.co.cu",
      "title": "Entorno Virtual de Aprendizaje (alternativo)",
      "searchTags": "moodle eva entorno virtual aprendizaje alternativo aula virtual cursos asignaturas plataforma educativa estudiantes profesores matricula material didactico udg universidad granma"
    },
    {
      "type": "EVEA EaD",
      "url": "https://evea.udg.co.cu",
      "title": "Espacio virtual de enseñanza-aprendizaje",
      "searchTags": "moodle evea espacio virtual ensenanza aprendizaje aula virtual cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico udg universidad granma"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://repositorio.udg.co.cu",
      "title": "Repositorio institucional de tesis y publicaciones",
      "searchTags": "repositorio institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones academicas produccion cientifica acceso abierto open access udg universidad granma"
    },
    {
      "type": "Repositorio Linux",
      "url": "https://repo.udg.co.cu",
      "title": "Repositorio local de paquetes para distribuciones Linux",
      "searchTags": "repositorio paquetes linux mirror local ubuntu debian fedora centos actualizaciones descargas software campus udg universidad granma"
    },
    {
      "type": "Revista Científica",
      "url": "https://revistas.udg.co.cu",
      "title": "Portal de revistas científicas de la UDG",
      "searchTags": "portal revistas cientificas publicaciones academicas articulos investigacion ojs acceso abierto open access udg universidad granma"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correos.udg.co.cu",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos udg universidad granma"
    },
    {
      "type": "Correo electrónico",
      "url": "https://webmail.udg.co.cu",
      "title": "Acceso web al correo de la UDG",
      "searchTags": "correo electronico webmail acceso alternativo email login bandeja entrada mensajes buzon udg universidad granma"
    },
    {
      "type": "SIGENU",
      "url": "https://secretaria.udg.co.cu",
      "title": "SIGENU - Sistema de Gestión de la Secretaría Docente",
      "searchTags": "sigenu sistema gestion universitaria notas calificaciones expediente matricula secretaria docente control academico historial academico estudiantes profesores udg universidad granma"
    },
    {
      "type": "Nube",
      "url": "https://cloud.udg.co.cu",
      "title": "Servicio de nube privada Nextcloud",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion udg universidad granma"
    }
  ]
},
  {
  "id": "uo",
  "name": "UO (Universidad de Oriente)",
  "logo": "logos/uo.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "http://www.uo.edu.cu/",
      "title": "Portal oficial de la Universidad de Oriente",
      "searchTags": "portal institucional noticias inicio universidad oriente uo santiago cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus santiaguero mella"
    },
    {
      "type": "Sitio Web",
      "url": "http://redes.uo.edu.cu/",
      "title": "Departamento de Redes y Servicios Telemáticos",
      "searchTags": "redes servicios telematicos departamento conectividad campus infraestructura internet intranet proxy navegacion wifi soporte tecnico telecomunicaciones uo universidad oriente"
    },
    {
      "type": "Sitio Web",
      "url": "http://reportes.uo.edu.cu/",
      "title": "Sistema de reportes y consultas académicas",
      "searchTags": "reportes consultas academicas sistema informacion estadisticas estudiantes profesores notas calificaciones rendimiento academico indicadores metricas uo universidad oriente"
    },
    {
      "type": "EVEA Pregrado",
      "url": "http://eva.uo.edu.cu/",
      "title": "Entorno Virtual de Aprendizaje para pregrado",
      "searchTags": "moodle eva entorno virtual aprendizaje pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes uo universidad oriente"
    },
    {
      "type": "EVEA Posgrado",
      "url": "http://cursos.uo.edu.cu/",
      "title": "Plataforma de cursos de posgrado y capacitación",
      "searchTags": "moodle posgrado cursos capacitacion superacion profesional maestrias doctorados diplomados plataforma educativa estudiantes profesores investigadores uo universidad oriente"
    },
    {
      "type": "Repositorio Institucional",
      "url": "http://referenciaict.uo.edu.cu",
      "title": "Repositorio de referencia del ICT",
      "searchTags": "repositorio referencia ict informacion cientifico tecnica documentos academicos publicaciones articulos libros tesis acceso abierto uo universidad oriente"
    },
    {
      "type": "Repositorio Institucional",
      "url": "http://repositorio.uo.edu.cu/",
      "title": "Repositorio académico institucional",
      "searchTags": "repositorio academico institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones produccion cientifica acceso abierto open access uo universidad oriente"
    },
    {
      "type": "Repositorio de OA",
      "url": "http://repotematico.uo.edu.cu/",
      "title": "Repositorio temático de objetos de aprendizaje",
      "searchTags": "repositorio tematico objetos aprendizaje recursos educativos digitales contenidos didacticos material docente guias tutoriales acceso abierto uo universidad oriente"
    },
    {
      "type": "Revista Científica",
      "url": "http://anuarioeco.uo.edu.cu/",
      "title": "Anuario de Ecología y Medio Ambiente",
      "searchTags": "revista cientifica anuario ecologia medio ambiente biodiversidad conservacion recursos naturales sostenibilidad cambio climatico uo universidad oriente"
    },
    {
      "type": "Revista Científica",
      "url": "http://maestroysociedad.uo.edu.cu/",
      "title": "Revista Maestro y Sociedad",
      "searchTags": "revista cientifica maestro sociedad educacion pedagogia didactica formacion docente ciencias sociales humanidades uo universidad oriente"
    },
    {
      "type": "Revista Científica",
      "url": "http://santiago.uo.edu.cu/",
      "title": "Revista Santiago - ciencias sociales y humanidades",
      "searchTags": "revista cientifica santiago ciencias sociales humanidades filosofia historia sociologia literatura arte cultura caribe uo universidad oriente"
    },
    {
      "type": "Revista Científica",
      "url": "http://tecnologiaquimica.uo.edu.cu/",
      "title": "Revista Tecnología Química",
      "searchTags": "revista cientifica tecnologia quimica ingenieria quimica procesos industriales biotecnologia farmacia alimentos medio ambiente uo universidad oriente"
    },
    {
      "type": "Revista Científica",
      "url": "http://cubanaquimica.uo.edu.cu",
      "title": "Revista Cubana de Química",
      "searchTags": "revista cientifica cubana quimica ciencias quimicas investigacion analitica organica inorganica fisicoquimica bioquimica uo universidad oriente"
    },
    {
      "type": "Correo electrónico",
      "url": "http://correo.uo.edu.cu/",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores administrativos uo universidad oriente"
    },
    {
      "type": "Correo electrónico",
      "url": "http://consejo.uo.edu.cu/",
      "title": "Acceso al correo del Consejo Universitario",
      "searchTags": "correo electronico consejo universitario webmail email login acceso bandeja entrada mensajes buzon directivos administracion uo universidad oriente"
    },
    {
      "type": "Nube",
      "url": "http://nube.uo.edu.cu/",
      "title": "Sistema de almacenamiento en nube propia",
      "searchTags": "nube almacenamiento cloud nextcloud drive archivos compartir colaboracion calendario contactos documentos fotos backup sincronizacion uo universidad oriente"
    }
  ]
},
  {
  "id": "ug",
  "name": "UG (Universidad de Guantánamo)",
  "logo": "logos/ug.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.cug.co.cu/",
      "title": "Portal institucional de la Universidad de Guantánamo",
      "searchTags": "portal institucional noticias inicio universidad guantanamo cug cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus guantanamero"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://cursovirtual.cug.co.cu/",
      "title": "Aula virtual de pregrado (Moodle)",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes cug universidad guantanamo"
    },
    {
      "type": "Repositorio Institucional",
      "url": "https://docsvirtual.cug.co.cu/",
      "title": "Repositorio virtual de documentos académicos",
      "searchTags": "repositorio virtual documentos academicos bibliografia digital apoyo cursos virtuales tesis trabajos diploma articulos libros cug universidad guantanamo"
    },
    {
      "type": "Bibliografías de apoyo al Moodle",
      "url": "https://docsvirtual.cug.co.cu/",
      "title": "Bibliografía digital de apoyo a cursos virtuales",
      "searchTags": "bibliografia digital apoyo cursos virtuales moodle documentos academicos recursos educativos descargas cug universidad guantanamo"
    },
    {
      "type": "Repositorio Institucional",
      "url": "http://repositorio.cug.co.cu:8080/jspui/",
      "title": "Repositorio institucional en DSpace",
      "searchTags": "repositorio institucional dspace tesis doctorado maestria pregrado trabajo diploma articulos libros publicaciones academicas produccion cientifica acceso abierto open access cug universidad guantanamo"
    },
    {
      "type": "Sitio Web Biblioteca",
      "url": "http://biblioteca.cug.co.cu/",
      "title": "Portal de la biblioteca universitaria",
      "searchTags": "biblioteca universitaria catalogo libros consulta busqueda bibliografica recurso documental prestamo sala lectura cug universidad guantanamo"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.cug.co.cu/",
      "title": "Servicio de correo electrónico institucional",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores estudiantes cug universidad guantanamo"
    }
  ]
},
  {
  "id": "uij",
  "name": "UIJ (Universidad de Isla de la Juventud)",
  "logo": "logos/uij.png",
  "resources": [
    {
      "type": "Sitio Web Institucional",
      "url": "https://www.uij.edu.cu",
      "title": "Portal oficial de la Universidad de la Isla de la Juventud",
      "searchTags": "portal institucional noticias inicio universidad isla juventud uij pinos cuba pregrado posgrado carreras investigacion innovacion extension facultades matricula estudiantes profesores campus"
    },
    {
      "type": "EVEA Pregrado",
      "url": "https://aulavirtual.uij.edu.cu",
      "title": "Aula virtual para la docencia de grado",
      "searchTags": "moodle aula virtual pregrado cursos asignaturas plataforma educativa estudiantes profesores matricula clases material didactico tareas foros cuestionarios examenes uij universidad isla juventud"
    },
    {
      "type": "EVEA Posgrado",
      "url": "https://postgrado.uij.edu.cu",
      "title": "Entorno virtual de enseñanza de posgrado",
      "searchTags": "moodle posgrado virtual superacion posgraduada cursos maestrias doctorados diplomados plataforma educativa estudiantes profesores uij universidad isla juventud"
    },
    {
      "type": "Repositorio de aplicaciones",
      "url": "https://ftp.uij.edu.cu",
      "title": "Servidor FTP con aplicaciones y documentos institucionales",
      "searchTags": "ftp servidor archivos descargas software aplicaciones documentos bibliografia utilidades herramientas informaticas repositorio archivos compartidos uij universidad isla juventud"
    },
    {
      "type": "Revista Científica",
      "url": "https://magisterio.uij.edu.cu",
      "title": "Revista Magisterio - ciencias pedagógicas",
      "searchTags": "revista cientifica magisterio ciencias pedagogicas educacion pedagogia didactica formacion docente uij universidad isla juventud"
    },
    {
      "type": "Correo electrónico",
      "url": "https://correo.uij.edu.cu",
      "title": "Servicio de correo electrónico para la comunidad universitaria",
      "searchTags": "correo electronico institucional webmail zimbra email login acceso bandeja entrada mensajes buzon correo profesores trabajadores estudiantes uij universidad isla juventud"
    }
  ]
}
]
;

  // ========== NOTIFICAR TEMA A ANDROID ==========
  function notifyAndroidTheme(isLight) {
    if (typeof AndroidTheme !== 'undefined' && AndroidTheme.setTheme) {
      AndroidTheme.setTheme(isLight ? 'light' : 'dark');
    }
  }

  // ========== ALIAS DE UNIVERSIDADES ==========
  const universityAliases = {
    'upr': ['pinar del río', 'pinareño', 'hermanos saíz', 'universidad de pinar del río'],
    'ua': ['artemisa', 'artemiseño', 'universidad de artemisa'],
    'uh': ['la habana', 'habanero', 'colina universitaria', 'universidad de la habana'],
    'uci': ['ciencias informáticas', 'informática', 'universidad de las ciencias informáticas'],
    'cujae': ['tecnológica de la habana', 'echeverría', 'cujae', 'universidad tecnológica de la habana'],
    'um': ['matanzas', 'matancero', 'camilo cienfuegos', 'universidad de matanzas'],
    'ucf': ['cienfuegos', 'cienfueguero', 'carlos rafael rodríguez', 'universidad de cienfuegos'],
    'uclv': ['las villas', 'villaclareño', 'marta abreu', 'universidad central', 'universidad de las villas', 'universidad central de las villas'],
    'uniss': ['sancti spíritus', 'sancti spiritus', 'espirituano', 'uniss', 'josé martí', 'jose marti', 'universidad de sancti spíritus', 'universidad de sancti spiritus'],
    'unica': ['ciego de ávila', 'ciego de avila', 'avileño', 'máximo gómez', 'maximo gomez', 'universidad de ciego de ávila'],
    'uc': ['camagüey', 'camaguey', 'camagüeyano', 'ignacio agramonte', 'universidad de camagüey'],
    'ult': ['las tunas', 'tunero', 'vladimir ilich lenin', 'universidad de las tunas'],
    'uho': ['holguín', 'holguin', 'holguinero', 'oscar lucero', 'universidad de holguín'],
    'umoa': ['moa', 'antonio núñez', 'antonio nuñez', 'universidad de moa'],
    'udg': ['granma', 'granmense', 'blas roca', 'universidad de granma'],
    'uo': ['oriente', 'santiago de cuba', 'santiaguero', 'mella', 'universidad de oriente'],
    'ug': ['guantánamo', 'guantanamo', 'guantanamero', 'cug', 'universidad de guantánamo'],
    'uij': ['isla de la juventud', 'pinos', 'uij', 'universidad de la isla de la juventud']
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
    tags.push(universityName.toLowerCase());
    
    return {
      ...resource,
      searchTags: [...new Set(tags)].join(' ')
    };
  }
  
  universitiesData.forEach(university => {
    university.resources = university.resources.map(resource => 
      enrichResourceWithTags(resource, university.id, university.name)
    );
  });

  // ========== TEMA POR DEFECTO: CLARO ==========
  const savedTheme = localStorage.getItem('theme');
  const initialIsLight = savedTheme !== 'dark';
  
  if (savedTheme === 'dark') {
    themeToggle.textContent = '☀️';
  } else {
    document.body.classList.add('light-mode');
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
  
  notifyAndroidTheme(initialIsLight);

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
              <button class="copy-link-btn" data-url="${resource.url}" aria-label="Copiar enlace">📋</button>
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
        btn.textContent = '✅';
        setTimeout(() => { btn.textContent = '📋'; }, 1500);
      });
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ========== VOLVER A LA LISTA ==========
  function backToList() {
    if (isSearchMode) renderUniversitiesList();
    universitiesListView.style.display = 'block';
    universityDetailView.style.display = 'none';
    currentUniversity = null;
    isSearchMode = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    
    // ===== DETECTAR UNIVERSIDAD ESPECÍFICA =====
    let targetUniversityId = null;
    
    for (const [uniId, aliases] of Object.entries(universityAliases)) {
      for (let alias of aliases) {
        const normalizedAlias = normalizeText(alias).toLowerCase();
        
        if (searchTerm.includes(normalizedAlias)) {
          targetUniversityId = uniId;
          break;
        }
        
        if (normalizedAlias.includes(searchTerm) && searchTerm.length > 3) {
          targetUniversityId = uniId;
          break;
        }
      }
      if (targetUniversityId) break;
    }
    
    if (!targetUniversityId) {
      for (const university of universitiesData) {
        const normalizedUniName = normalizeText(university.name.toLowerCase());
        if (normalizedUniName.includes(searchTerm) || searchTerm.includes(normalizedUniName)) {
          targetUniversityId = university.id;
          break;
        }
      }
    }
    
    let matchedResources = [];
    
    if (targetUniversityId) {
      const targetUniversity = universitiesData.find(u => u.id === targetUniversityId);
      
      const nonUniversityWords = searchWords.filter(word => {
        const isAlias = universityAliases[targetUniversityId]?.some(alias => 
          normalizeText(alias).toLowerCase().includes(word) || word.includes(normalizeText(alias).toLowerCase())
        );
        const isName = normalizeText(targetUniversity.name.toLowerCase()).includes(word);
        return !isAlias && !isName;
      });
      
      targetUniversity.resources.forEach(resource => {
        const searchText = normalizeText(`${resource.type} ${resource.title} ${resource.searchTags || ''}`).toLowerCase();
        
        if (nonUniversityWords.length === 0) {
          matchedResources.push({
            universityId: targetUniversity.id,
            universityName: targetUniversity.name,
            universityLogo: targetUniversity.logo,
            resource: resource
          });
        } else {
          const hasMatch = nonUniversityWords.some(word => searchText.includes(word));
          if (hasMatch) {
            matchedResources.push({
              universityId: targetUniversity.id,
              universityName: targetUniversity.name,
              universityLogo: targetUniversity.logo,
              resource: resource
            });
          }
        }
      });
    } else {
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
      noResultsMessage.textContent = `No se encontraron resultados para "${rawSearchTerm}"`;
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
            <button class="copy-link-btn" data-url="${resource.url}" aria-label="Copiar enlace">📋</button>
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
          copyToClipboard(url);
          copyBtn.textContent = '✅';
          setTimeout(() => { copyBtn.textContent = '📋'; }, 1500);
        });
      });
    });
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
      alert('Enlace copiado al portapapeles');
    }).catch(err => {
      console.error('Error al copiar: ', err);
      alert('No se pudo copiar el enlace');
    });
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
        li.innerHTML = `<a href="${fav.url}" target="_blank" rel="noopener noreferrer">${fav.title}</a><button class="remove-favorite" data-index="${index}">&times;</button>`;
        favoritesList.appendChild(li);
      });
      document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.target.getAttribute('data-index'));
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

  // ========== FUNCIONES DE HISTORIAL ==========
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

  // ========== FUNCIONES DE LINKS PERSONALIZADOS ==========
  function showCustomLinks() {
    customLinksList.innerHTML = '';
    if (customLinks.length === 0) {
      customLinksList.innerHTML = '<li>No tienes links guardados. Usa el formulario para añadir uno.</li>';
    } else {
      customLinks.forEach((link, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `
          <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.title}</a>
          <button class="delete-custom-link" data-index="${index}" aria-label="Eliminar link">&times;</button>
        `;
        customLinksList.appendChild(li);
      });
      document.querySelectorAll('.delete-custom-link').forEach(btn => {
        btn.addEventListener('click', (e) => {
          deleteCustomLink(parseInt(e.target.getAttribute('data-index')));
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
    if (!title || !url) { alert('Por favor, completa ambos campos'); return; }
    if (!url.startsWith('http')) url = 'https://' + url;
    customLinks.push({ title, url });
    localStorage.setItem('customLinks', JSON.stringify(customLinks));
    newLinkTitle.value = '';
    newLinkUrl.value = '';
    showCustomLinks();
    alert('Link guardado correctamente');
  }

  // ========== ACERCA DE Y OPINIÓN ==========
  function showAbout() { aboutModal.style.display = 'block'; }
  function sendFeedback() {
    window.location.href = `mailto:cocabenapps@gmail.com?subject=${encodeURIComponent('Opinión sobre SaberCuba')}&body=${encodeURIComponent('Hola, mi opinión sobre SaberCuba:\n\n')}`;
  }

  // ========== REGISTRAR CLICS EN HISTORIAL ==========
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('resource-link') || (e.target.tagName === 'A' && e.target.href && !e.target.href.includes('#') && !e.target.id)) {
      addToHistory(e.target.href, e.target.textContent || e.target.getAttribute('data-title') || e.target.href);
    }
  });

  // ========== EVENT LISTENERS ==========
  renderUniversitiesList();
  backToListBtn.addEventListener('click', backToList);
  searchInput.addEventListener('input', performSearch);
  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') performSearch(); });
  hamburger.addEventListener('click', () => { navMenu.classList.toggle('active'); hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active')); });
  document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { navMenu.classList.remove('active'); hamburger.setAttribute('aria-expanded', 'false'); }); });
  favoritesLink.addEventListener('click', (e) => { e.preventDefault(); showFavorites(); });
  historyLink.addEventListener('click', (e) => { e.preventDefault(); showHistory(); navMenu.classList.remove('active'); });
  customLinksLink.addEventListener('click', (e) => { e.preventDefault(); showCustomLinks(); navMenu.classList.remove('active'); });
  aboutLink.addEventListener('click', (e) => { e.preventDefault(); showAbout(); navMenu.classList.remove('active'); });
  feedbackLink.addEventListener('click', (e) => { e.preventDefault(); sendFeedback(); navMenu.classList.remove('active'); });
  saveNewLinkBtn.addEventListener('click', saveNewLink);
  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
  closeModal.forEach(btn => btn.addEventListener('click', () => favoritesModal.style.display = 'none'));
  document.querySelectorAll('.close-history, .close-custom, .close-about').forEach(btn => btn.addEventListener('click', () => { historyModal.style.display = 'none'; customLinksModal.style.display = 'none'; aboutModal.style.display = 'none'; }));
  window.addEventListener('click', (event) => { if (event.target === favoritesModal) favoritesModal.style.display = 'none'; if (event.target === historyModal) historyModal.style.display = 'none'; if (event.target === customLinksModal) customLinksModal.style.display = 'none'; if (event.target === aboutModal) aboutModal.style.display = 'none'; });
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    themeToggle.textContent = isLight ? '🌙' : '☀️';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    notifyAndroidTheme(isLight);
  });
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterType = btn.getAttribute('data-filter');
      setActiveFilter(filterType);
    });
  });
});