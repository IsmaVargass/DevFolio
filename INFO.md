# 📘 INFO.md - Documentación Completa del Código JavaScript

Este documento explica **todos los archivos JavaScript** del proyecto DevFolio, sus funciones principales y para qué sirven.

---

## 📑 Índice de Archivos

1. [auth.js](#authjs) - Autenticación y Registro
2. [auth-guard.js](#auth-guardjs) - Protección de Páginas
3. [app.js](#appjs) - Dashboard Principal
4. [profile.js](#profilejs) - Gestión de Perfil
5. [portfolio_builder.js](#portfolio_builderjs) - Constructor de Portfolio
6. [communities.js](#communitiesjs) - Sistema de Comunidades
7. [group_view.js](#group_viewjs) - Vista de Grupos
8. [messages.js](#messagesjs) - Sistema de Mensajería
9. [admin_panel.js](#admin_paneljs) - Panel de Administración
10. [customer_support.js](#customer_supportjs) - Soporte al Cliente
11. [experience.js](#experiencejs) - Gestión de Experiencia
12. [skills.js](#skillsjs) - Gestión de Habilidades
13. [projects.js](#projectsjs) - Gestión de Proyectos
14. [tutorial.js](#tutorialjs) - Tutorial Interactivo
15. [notifications.js](#notificationsjs) - Sistema de Notificaciones
16. [utils.js](#utilsjs) - Utilidades Generales
17. [toast.js](#toastjs) - Notificaciones Toast

---

## auth.js

**Ubicación:** `js/auth.js`  
**Propósito:** Maneja toda la autenticación de usuarios (login y registro)

### Funciones Principales

#### `loginUser()`
**¿Qué hace?**
- Procesa el formulario de inicio de sesión
- Valida email y contraseña
- Busca el usuario en localStorage (`all_users`)
- Verifica que la contraseña coincida
- Guarda la sesión en localStorage (`user`)
- Actualiza `lastActive` con la fecha actual
- Redirige al dashboard o admin panel según el rol

**¿Cuándo se ejecuta?**
- Al enviar el formulario de login (`login.html`)

**Flujo:**
1. Lee email y password del formulario
2. Obtiene todos los usuarios de localStorage
3. Busca usuario con ese email
4. Compara contraseña
5. Si coincide → Guarda sesión y redirige
6. Si no coincide → Muestra error

#### `registerUser()`
**¿Qué hace?**
- Procesa el formulario de registro
- Valida que todos los campos estén completos
- Verifica que el email no esté ya registrado
- Crea un nuevo objeto usuario
- Lo guarda en `all_users` de localStorage
- Automáticamente inicia sesión
- Redirige al dashboard

**Validaciones:**
- Email único (no duplicados)
- Contraseña mínimo 6 caracteres
- Nombre completo requerido
- Email válido format

**Estructura del usuario creado:**
```javascript
{
  email: "usuario@email.com",
  nombre: "Juan Pérez",
  password: "123456",
  role: "user", // Por defecto
  registeredDate: "2025-12-07T...",
  lastActive: "2025-12-07T...",
  // ... otros campos vacíos
}
```

#### `logout()`
**¿Qué hace?**
- Elimina la sesión actual
- Borra el objeto `user` de localStorage
- Redirige a la landing page
- Limpia cualquier dato temporal

---

## auth-guard.js

**Ubicación:** `js/auth-guard.js`  
**Propósito:** Proteger páginas que requieren autenticación

### Funciones Principales

#### `checkAuth()`
**¿Qué hace?**
- Se ejecuta automáticamente al cargar cualquier página protegida
- Lee el usuario actual de localStorage
- Verifica que existe y tiene sesión activa
- Si NO hay sesión → Redirige a login
- Si hay sesión → Permite continuar

**¿Dónde se usa?**
- En TODAS las páginas excepto:
  - `index.html` (landing)
  - `login.html`
  - `register.html`

**Implementación:**
```html
<script src="../js/auth-guard.js"></script>
<!-- Se ejecuta automáticamente al cargar -->
```

#### `checkRole(requiredRole)`
**¿Qué hace?**
- Verifica que el usuario tenga el rol suficiente
- Compara jerarquía de roles:
  - `user` = nivel 1
  - `tecnico` = nivel 2
  - `admin` = nivel 3
- Si el rol es insuficiente → Redirige al dashboard

**Ejemplo de uso:**
```javascript
// En admin_panel.js
checkRole('admin'); // Solo admins y técnicos
```

---

## app.js

**Ubicación:** `js/app.js`  
**Propósito:** Dashboard principal del usuario

### Funciones Principales

#### `loadDashboard()`
**¿Qué hace?**
- Carga los datos del usuario actual
- Muestra nombre de bienvenida
- Renderiza las estadísticas personales:
  - Portfolios publicados
  - Mensajes no leídos
  - Notific aciones pendientes
  - Grupos unidos

**¿Cuándo se ejecuta?**
- Al cargar `dashboard.html`
- Evento: `DOMContentLoaded`

#### `updateUserStats()`
**¿Qué hace?**
- Calcula estadísticas del usuario actual
- Cuenta portfolios del usuario
- Cuenta mensajes no leídos
- Cuenta notificaciones sin leer
- Actualiza los números en las tarjetas del dashboard

**Cálculos:**
```javascript
// Portfolios del usuario
const userPortfolios = portfolios.filter(p => p.userId === user.email);

// Mensajes no leídos
const unreadMessages = conversations.filter(c => 
  c.participants.includes(user.email) && 
  c.messages.some(m => !m.read && m.senderId !== user.email)
);
```

#### `loadRecentActivity()`
**¿Qué hace?**
- Muestra actividad reciente del usuario:
  - Últimos portfolios publicados
  - Mensajes recientes
  - Tickets creados
  - Actividad en grupos

---

## profile.js

**Ubicación:** `js/profile.js`  
**Propósito:** Gestión del perfil de usuario

### Funciones Principales

#### `loadProfile()`
**¿Qué hace?**
- Carga todos los datos del perfil del usuario actual
- Rellena los formularios con la información guardada
- Carga la foto de perfil si existe
- Muestra las habilidades (skills)
- Muestra los links de redes sociales

**Datos que carga:**
- Información personal (nombre, bio, ubicación, teléfono)
- Información profesional (título, empresa)
- Redes sociales (GitHub, LinkedIn, Twitter, Web)
- Foto de perfil (base64)
- Lista de habilidades

#### `saveProfile()`
**¿Qué hace?**
- Guarda todos los cambios del perfil
- Actualiza el objeto `user` en localStorage
- Actualiza también `all_users` (para que otros lo vean)
- Muestra toast de confirmación
- Recarga los datos para confirmar

**Proceso:**
1. Lee todos los campos del formulario
2. Crea objeto con los datos actualizados
3. Actualiza `user` en localStorage
4. Busca el usuario en `all_users` y actualiza ahí también
5. Muestra mensaje de éxito

#### `uploadProfilePhoto()`
**¿Qué hace?**
- Permite subir una foto de perfil
- Convierte la imagen a base64
- Guarda el base64 en el perfil
- Muestra preview de la imagen
- Comprime si es muy grande

**Proceso:**
```javascript
1. Usuario selecciona archivo → Input file
2. Se lee el archivo con FileReader
3. Se convierte a base64
4. Se guarda en user.profile_photo
5. Se muestra en la página
```

#### `addSkill()`
**¿Qué hace?**
- Añade una nueva habilidad al perfil
- Actualiza el array `user.skills`
- Muestra la skill en la lista
- Previene duplicados

**Validación:**
- No permite skills vacías
- No permite duplicados
- Máximo recomendado: 20 skills

#### `removeSkill(skillName)`
**¿Qué hace?**
- Elimina una habilidad del perfil
- Filtra el array `user.skills`
- Actualiza la vista
- Guarda los cambios

---

## portfolio_builder.js

**Ubicación:** `js/portfolio_builder.js`  
**Propósito:** Constructor visual de portfolios

### Funciones Principales

#### `initPortfolioBuilder()`
**¿Qué hace?**
- Inicializa el constructor al cargar la página
- Carga datos del perfil del usuario
- Configura los 2 paneles (editor + preview)
- Carga colores y fuentes por defecto
- Setup de todos los listeners

**Inicialización:**
```javascript
portfolioData = {
  user: { ...datosDelUsuario },
  colors: { primary, secondary, accent, background, text },
  fonts: { heading, body },
  content: { about, objective, projects, languages },
  experience: [],
  education: [],
  skills: [],
  visibility: 'public'
}
```

#### `updatePreview()`
**¿Qué hace?**
- Regenera el preview en tiempo real
- Se ejecuta en CADA input del usuario
- Aplica colores personalizados
- Aplica fuentes seleccionadas
- Renderiza todo el contenido

**¿Cuándo se ejecuta?**
- Al cambiar colores
- Al cambiar fuentes
- Al escribir en cualquier textarea
- Al añadir/editar experiencia
- Al añadir/editar educación
- Etc.

**Proceso:**
1. Lee datos de `portfolioData`
2. Aplica CSS custom properties
3. Genera HTML del CV
4. Inserta en el panel derecho

#### `applyColors()`
**¿Qué hace?**
- Aplica los colores seleccionados al preview
- Usa CSS Custom Properties (variables)
- Actualización dinámica sin recargar

**Código:**
```javascript
document.documentElement.style.setProperty('--primary-color', portfolioData.colors.primary);
document.documentElement.style.setProperty('--secondary-color', portfolioData.colors.secondary);
// ... etc
```

#### `applyFonts()`
**¿Qué hace?**
- Aplica las fuentes de Google Fonts seleccionadas
- Carga la fuente si no está cargada
- Actualiza heading y body fonts

**Fuentes disponibles:**
- Roboto, Open Sans, Lato, Montserrat, Poppins
- Raleway, Inter, Nunito, Playfair Display
- Y más... (~20 opciones)

#### `addExperience()`
**¿Qué hace?**
- Añade una experiencia laboral al portfolio
- Abre modal con formulario
- Campos: Empresa, Puesto, Fechas, Descripción
- Guarda en `portfolioData.experience`
- Actualiza preview

#### `editExperience(index)`
**¿Qué hace?**
- Edita una experiencia existente
- Carga los datos en el formulario
- Permite modificar
- Actualiza el array y preview

#### `deleteExperience(index)`
**¿Qué hace?**
- Elimina una experiencia del portfolio
- Remueve del array
- Actualiza preview

**Mismo patrón para:**
- `addEducation()` / `editEducation()` / `deleteEducation()`
- `addProject()` / `editProject()` / `deleteProject()`
- `addLanguage()` / `editLanguage()` / `deleteLanguage()`

#### `importFromProfile()`
**¿Qué hace?**
- Importa datos automáticamente del perfil
- Trae experiencia, educación, skills
- Evita tener que escribir todo desde cero
- Botón de "Rellenar con datos del perfil"

#### `publishPortfolio()`
**¿Qué hace?**
- Publica el portfolio para que otros lo vean
- Valida que tenga contenido mínimo
- Crea objeto completo con todos los datos
- Guarda en `published_portfolios` de localStorage
- Asigna ID único (timestamp)
- Redirige a Communities

**Validaciones antes de publicar:**
- Debe tener nombre
- Debe tener al menos una sección con contenido
- Debe tener colores configurados

**Objeto publicado:**
```javascript
{
  id: Date.now(),
  userId: user.email,
  title: "Portfolio de Juan",
  author: user.nombre,
  photo: user.profile_photo,
  colors: { ... },
  fonts: { ... },
  content: { ... },
  experience: [ ... ],
  education: [ ... ],
  skills: [ ... ],
  visibility: 'public',
  publishedDate: "2025-12-07T...",
  views: 0,
  tags: ["Portfolio", "Profesional"]
}
```

---

## communities.js

**Ubicación:** `js/communities.js`  
**Propósito:** Sistema de comunidades y ofertas de trabajo

### Configuración de API

```javascript
const ADZUNA_APP_ID = '141e0cfe';
const ADZUNA_APP_KEY = '87c8f24eeb70fb73a397564f62ffa0ca';
const ADZUNA_API_BASE = 'https://api.adzuna.com/v1/api/jobs/es/search';
```

### Funciones Principales

#### `loadRecentPortfolios()`
**¿Qué hace?**
- Carga portfolios publicados recientemente
- Ordena por fecha de publicación (más recientes primero)
- Muestra en tarjetas con preview
- Máximo 20 portfolios

**Renderiza:**
- Foto del autor
- Título del portfolio
- Nombre del autor
- Tags
- Botón para ver completo

#### `loadFeaturedPortfolios()`
**¿Qué hace?**
- Carga portfolios destacados (más vistos)
- Filtra solo los que tienen vistas > 0
- Ordena por número de vistas (descendente)
- Muestra contador de vistas

**Diferencia con recientes:**
- Criterio: vistas en lugar de fecha
- Solo muestra exitosos

#### `viewPortfolio(portfolioId)`
**¿Qué hace?**
- Muestra portfolio completo en modal
- Incrementa contador de vistas
- Muestra toda la información:
  - Datos personales
  - Sobre mí
  - Experiencia completa
  - Educación completa
  - Habilidades
  - Proyectos
  - Idiomas
- Botón para enviar mensaje al autor

**Tracking de vistas:**
```javascript
portfolio.views = (portfolio.views || 0) + 1;
localStorage.setItem('published_portfolios', JSON.stringify(portfolios));
```

#### `fetchAdzunaJobs(keyword, location)`
**⭐ FUNCIÓN MÁS IMPORTANTE - INTEGRACIÓN API ⭐**

**¿Qué hace?**
- Hace petición HTTP a la API de Adzuna
- Obtiene ofertas de trabajo reales
- Filtra por categoría IT jobs
- Permite búsqueda por keyword y location

**Parámetros:**
- `keyword` - Palabra clave (ej: "React", "JavaScript")
- `location` - Ubicación (ej: "Madrid", "Barcelona")

**Proceso completo:**
```javascript
1. Construir URL con parámetros
2. Agregar credenciales (app_id, app_key)
3. Agregar filtros del usuario (opcional)
4. Hacer fetch() a la API
5. Parsear respuesta JSON
6. Retornar array de trabajos
7. Manejar errores si ocurren
```

**URL construida:**
```
https://api.adzuna.com/v1/api/jobs/es/search/1
  ?app_id=141e0cfe
  &app_key=87c8f24eeb70fb73a397564f62ffa0ca
  &results_per_page=20
  &content-type=application/json
  &category=it-jobs
  &what=javascript (si hay keyword)
  &where=madrid (si hay location)
```

**Manejo de errores:**
- Try-catch para capturar errores de red
- Verificación de response.ok
- Mensaje de error user-friendly
- Return de array vacío si falla

#### `renderJobs(jobs)`
**¿Qué hace?**
- Renderiza las ofertas de trabajo en tarjetas
- Muestra información de cada job:
  - Título del puesto
  - Empresa
  - Ubicación
  - Descripción (truncada)
  - Salario (si disponible)
- Click lleva a la oferta completa en Adzuna

#### `searchJobs()`
**¿Qué hace?**
- Se ejecuta al hacer click en "Buscar"
- Lee los filtros del usuario (keyword, location)
- Llama a `fetchAdzunaJobs()`
- Muestra loading spinner
- Renderiza resultados
- Maneja errores y empty states

**Estados de UI:**
```javascript
- LOADING: Muestra spinner
- SUCCESS: Renderiza trabajos
- EMPTY: Mensaje "No se encontraron ofertas"
- ERROR: Mensaje de error amigable
```

#### `loadGroups()`
**¿Qué hace?**
- Carga los grupos de trabajo disponibles
- 3 grupos predefinidos:
  - React Developers
  - Vue.js Community
  - Angular Developers
- Grupos personalizados creados por usuarios
- Muestra miembros count
- Botón Join/Leave según estado

#### `joinGroup(groupId)`
**¿Qué hace?**
- Une al usuario a un grupo
- Añade registro a `joined_groups`
- Actualiza contador de miembros
- Cambia botón a "Dejar grupo"
- Ahora puede ver miembros y participar

**Estructura de membresía:**
```javascript
{
  userId: user.email,
  groupId: "react-developers",
  joinedDate: "2025-12-07T..."
}
```

#### `leaveGroup(groupId)`
**¿Qué hace?**
- Saca al usuario del grupo
- Elimina de `joined_groups`
- Decrementa contador de miembros
- Cambia botón a "Unirse"

#### `announcePortfolioToGroup(groupId)`
**¿Qué hace?**
- Comparte tu portfolio con el grupo
- Crea un post en el grupo
- Todos los miembros lo ven
- Útil para darse a conocer

#### `createGroup()`
**¿Qué hace?**
- Crea un nuevo grupo personalizado
- Modal con formulario (nombre, descripción, categoría)
- Guarda en `custom_groups`
- Te una automáticamente
- Aparece en la lista

---

## group_view.js

**Ubicación:** `js/group_view.js`  
**Propósito:** Vista detallada de un grupo

### Funciones Principales

#### `loadGroupDetails()`
**¿Qué hace?**
- Carga información completa del grupo
- Muestra nombre, descripción, miembros
- 3 tabs: Discusiones, Portfolios, Miembros

#### `loadDiscussions()`
**¿Qué hace?**
- Carga hilos de discusión del grupo
- Ordenados por actividad reciente
- Permite crear nuevos hilos
- Responder a hilos existentes

#### `createDiscussion()`
**¿Qué hace?**
- Crea un nuevo hilo de discusión
- Título y contenido inicial
- Se guarda vinculado al grupo
- Notifica a miembros

#### `replyToDiscussion(discussionId)`
**¿Qué hace?**
- Añade respuesta a un hilo
- Marca autor y timestamp
- Actualiza contador de respuestas

#### `loadGroupPortfolios()`
**¿Qué hace?**
- Muestra portfolios compartidos en el grupo
- Solo de miembros activos
- Permite ver portfolio completo

#### `loadGroupMembers()`
**¿Qué hace?**
- Lista todos los miembros del grupo
- Solo visible si eres miembro
- Muestra foto, nombre, título profesional
- Botón para enviar mensaje

---

## messages.js

**Nota:** Este archivo no estaba en la lista pero existe en el proyecto

### Funciones Principales

#### `loadConversations()`
**¿Qué hace?**
- Carga todas las conversaciones del usuario
- Filtra donde esté en participants
- Ordena por última actividad
- Muestra badge de no leídos

#### `openConversation(conversationId)`
**¿Qué hace?**
- Abre una conversación específica
- Muestra historial completo de mensajes
- Marca mensajes como leídos
- Permite escribir nuevo mensaje

#### `sendMessage(conversationId, text)`
**¿Qué hace?**
- Envía un mensaje en la conversación
- Crea objeto mensaje con:
  - sender
  - text
  - timestamp
  - read: false (para el receptor)
- Añade al array messages
- Actualiza lastMessageDate
- Scroll al último mensaje

#### `newConversation()`
**¿Qué hace?**
- Abre modal para nueva conversación
- Buscador de usuarios
- Selecciona destinatario
- Crea conversación nueva
- Permite enviar primer mensaje

#### `searchUsers(query)`
**¿Qué hace?**
- Busca usuarios en tiempo real
- Filtra por nombre o email
- Muestra resultados mientras escribes
- Excluye usuario actual

**Búsqueda:**
```javascript
const filtered = allUsers.filter(u =>
  u.nombre.toLowerCase().includes(query.toLowerCase()) ||
  u.email.toLowerCase().includes(query.toLowerCase())
);
```

#### `insertEmoji(emoji)`
**¿Qué hace?**
- Inserta emoji en el textarea
- Mantiene posición del cursor
- Cierra el picker

---

## admin_panel.js

**Ubicación:** `js/admin_panel.js`  
**Propósito:** Panel de administración completo

### Funciones Principales

#### `loadStatistics()`
**¿Qué hace?**
- Calcula estadísticas generales del sistema
- Total usuarios, portfolios, tickets
- Usuarios activos (últimos 7 días)
- Actualiza las 4 tarjetas superiores

**Cálculos:**
```javascript
// Usuarios activos
const activeUsers = users.filter(u => {
  const diffDays = (now - new Date(u.lastActive)) / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
}).length;

// Tickets abiertos
const openTickets = tickets.filter(t => t.status !== 'closed').length;
```

#### `loadTickets()`
**¿Qué hace?**
- Carga TODOS los tickets del sistema
- No filtra por usuario (como en customer support)
- Muestra todos para que admin pueda gestionar

#### `renderTickets(filter)`
**¿Qué hace?**
- Renderiza tickets según filtro
- Filtros: 'all', 'open', 'in_progress', 'closed'
- Ordena por fecha (más recientes primero)

**Filtrado:**
```javascript
if (filter !== 'all') {
  filtered = tickets.filter(t => t.status === filter);
}
```

#### `viewTicket(ticketId)`
**¿Qué hace?**
- Muestra ticket completo en modal
- Toda la información del usuario
- Descripción del problema
- Historial de respuestas
- Formulario para responder

#### `respondTicket(event, ticketId)`
**¿Qué hace?**
- Responde a un ticket de soporte
- Añade respuesta al array `responses`
- Permite cambiar estado del ticket
- Marca `hasNewResponse = true` para el usuario
- Guarda todo en localStorage

**Objeto respuesta:**
```javascript
{
  author: admin.nombre,
  text: "Texto de la respuesta",
  date: "2025-12-07T..."
}
```

**Proceso:**
1. Lee texto de respuesta
2. Lee nuevo estado seleccionado
3. Añade respuesta al ticket
4. Actualiza estado
5. Marca `hasNewResponse = true`
6. Guarda en localStorage
7. Cierra modal
8. Recarga listas
9. Toast de confirmación

#### `loadUsers()`
**¿Qué hace?**
- Carga tabla con TODOS los usuarios registrados
- Muestra: Nombre, Email, Rol, Fecha registro
- Dropdown para cambiar rol
- Botón para password reset

#### `changeUserRole(email, newRole)`
**¿Qué hace?**
- Cambia el rol de un usuario
- Actualiza en `all_users`
- Si es el usuario actual, actualiza `user` también
- Registra en `admin_logs`
- Toast de confirmación

**Protección:**
```javascript
// No puedes cambiar tu propio rol
if (email === currentUser.email) {
  dropdown.disabled = true;
}
```

**Log de auditoría:**
```javascript
{
  action: 'role_change',
  targetUser: "usuario@email.com",
  oldRole: "user",
  newRole: "admin",
  adminUser: "admin@email.com",
  timestamp: "2025-12-07T..."
}
```

#### `openPasswordResetModal(email, nombre)`
**¿Qué hace?**
- Abre modal para enviar email de reset
- Muestra email del destinatario
- Campo opcional para mensaje personalizado
- Botón para confirmar envío

#### `confirmPasswordReset()`
**¿Qué hace?**
- Simula envío de email (no hay SMTP real)
- Registra acción en `admin_logs`
- Toast de confirmación
- Cierra modal

**Log:**
```javascript
{
  action: 'password_reset_email',
  targetUser: "usuario@email.com",
  adminUser: "admin@email.com",
  customMessage: "Mensaje opcional",
  timestamp: "2025-12-07T..."
}
```

#### `setupUserSearch()`
**¿Qué hace?**
- Configura buscador de usuarios
- Filtrado en tiempo real
- Por nombre O email
- Actualiza tabla automáticamente

#### `loadReports()`
**¿Qué hace?**
- Genera todos los reportes y estadísticas
- **4 secciones:**
  1. Actividad de Usuarios
  2. Portfolios
  3. Soporte
  4. Grupos de Trabajo

**Cálculos complejos:**

**1. Actividad de Usuarios:**
```javascript
// Total
document.getElementById('report-total-users').textContent = users.length;

// Activos hoy
const activeToday = users.filter(u => {
  const lastActive = new Date(u.lastActive);
  return lastActive >= today;
}).length;

// Nuevos esta semana
const newUsersWeek = users.filter(u => {
  const registered = new Date(u.registeredDate);
  return registered >= weekAgo;
}).length;

// Última actividad
const lastActivity = users.reduce((latest, u) => {
  const lastActive = new Date(u.lastActive);
  return !latest || lastActive > latest ? lastActive : latest;
}, null);
```

**2. Portfolios:**
```javascript
// Total vistas
const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0);

// Portfolio más visto
const topPortfolio = portfolios.reduce((top, p) => {
  return (!top || p.views > top.views) ? p : top;
}, null);
```

**3. Soporte:**
```javascript
// Tasa de resolución
const resolutionRate = tickets.length > 0 
  ? Math.round((tickets.filter(t => t.status === 'closed').length / tickets.length) * 100)
  : 0;
```

**4. Grupos:**
```javascript
// Grupo más activo
const topGroup = customGroups.reduce((top, g) => {
  return (!top || g.members > top.members) ? g : top;
}, null);
```

#### `switchTab(tabName)`
**¿Qué hace?**
- Cambia entre tabs del admin panel
- Oculta contenido anterior
- Muestra contenido nuevo
- Actualiza botones activos

---

## customer_support.js

**Ubicación:** `js/customer_support.js`  
**Propósito:** Sistema de soporte para usuarios

### Funciones Principales

#### `loadTickets()`
**¿Qué hace?**
- Carga tickets del usuario actual
- Filtra donde `user === currentUser.email`
- Muestra solo mis tickets (diferente de admin)
- Badge "Nueva respuesta" si `hasNewResponse === true`

#### `showTicketDetail(ticketId)`
**¿Qué hace?**
- Muestra detalle completo del ticket
- Tu consulta original
- Todas las respuestas del equipo
- Marca como leído automáticamente
- Quita badge de "nueva respuesta"

**Al abrir:**
```javascript
if (ticket.hasNewResponse) {
  ticket.hasNewResponse = false; // Marcar como leído
  localStorage.setItem('support_tickets', JSON.stringify(tickets));
  loadTickets(); // Actualizar lista (quita badge)
}
```

**Renderiza respuestas:**
```javascript
ticket.responses.forEach(r => {
  // Muestra:
  // - Nombre del que respondió
  // - Fecha y hora
  // - Texto completo
  // - Colores alternados (verde/azul)
});
```

#### `setupModal()`
**¿Qué hace?**
- Configura modal de crear ticket
- Eventos de abrir/cerrar
- Submit del formulario

#### `submitTicket()`
**¿Qué hace?**
- Procesa formulario de nuevo ticket
- Crea objeto ticket:
  ```javascript
  {
    id: Date.now(),
    user: user.email,
    userName: user.nombre,
    userEmail: user.email,
    subject: "...",
    category: "...", // technical, account, billing, etc.
    priority: "...", // low, medium, high, urgent
    description: "...",
    status: 'open',
    created: new Date().toISOString(),
    responses: [],
    hasNewResponse: false
  }
  ```
- Guarda en `support_tickets`
- Cierra modal
- Toast de confirmación
- Recarga lista

#### `setupAccordion()`
**¿Qué hace?**
- Configura FAQ accordion
- Click para expandir/contraer
- Solo una pregunta abierta a la vez
- Transiciones suaves

#### `setupTutorialButton()`
**¿Qué hace?**
- Configura botón "Reiniciar tutorial"
- Borra flag `tutorial_completed`
- Redirige al dashboard
- Tutorial se ejecuta automáticamente

---

## experience.js

**Ubicación:** `js/experience.js`  
**Propósito:** Gestión de experiencia laboral

### Funciones Principales

#### `loadExperience()`
**¿Qué hace?**
- Carga experiencias del usuario desde perfil
- Muestra en timeline visual
- Ordenadas por fecha (más recientes primero)

#### `addExperience()`
**¿Qué hace?**
- Abre modal para nueva experiencia
- Formulario con:
  - Nombre empresa/organización
  - Puesto/posición
  - Fecha inicio
  - Fecha fin (o "Actualidad")
  - Descripción de responsabilidades
- Guarda en perfil del usuario
- Actualiza vista

#### `editExperience(index)`
**¿Qué hace?**
- Carga experiencia en formulario
- Permite modificar
- Actualiza en el array
- Guarda cambios

#### `deleteExperience(index)`
**¿Qué hace?**
- Confirma con el usuario
- Elimina del array
- Actualiza vista
- Guarda en localStorage

---

## skills.js

**Ubicación:** `js/skills.js`  
**Propósito:** Gestión de habilidades técnicas

### Funciones Principales

#### `loadSkills()`
**¿Qué hace?**
- Carga habilidades del usuario
- Muestra en tarjetas con colores
- Permite editar/eliminar cada una

#### `openAddSkillModal()`
**¿Qué hace?**
- Abre modal para añadir skill
- Input para nombre de skill
- Botón añadir
- Validación de duplicados

#### `addSkill(skillName)`
**¿Qué hace?**
- Añade skill al array del usuario
- Valida que no exista ya
- Valida que no esté vacía
- Actualiza vista
- Guarda en localStorage

#### `deleteSkill(skillName)`
**¿Qué hace?**
- Elimina skill del array
- Actualiza vista
- Guarda cambios

---

## projects.js

**Ubicación:** `js/projects.js`  
**Propósito:** Gestión de proyectos personales

### Funciones Principales

#### `loadProjects()`
**¿Qué hace?**
- Carga proyectos del usuario
- Muestra en tarjetas
- Con nombre, descripción, link

#### `addProject()`
**¿Qué hace?**
- Modal para nuevo proyecto
- Campos:
  - Nombre del proyecto
  - Descripción
  - URL/Link (opcional)
  - Tecnologías usadas
- Guarda en perfil
- Actualiza vista

#### `editProject(index)`
**¿Qué hace?**
- Carga proyecto en modal
- Permite editar
- Actualiza

#### `deleteProject(index)`
**¿Qué hace?**
- Elimina proyecto
- Confirma antes
- Actualiza vista

---

## tutorial.js

**Ubicación:** `js/tutorial.js`  
**Propósito:** Tutorial interactivo para nuevos usuarios

### Funciones Principales

#### `startTutorial()`
**¿Qué hace?**
- Inicia el tutorial paso a paso
- Solo se ejecuta si es primera vez
- Verifica flag `tutorial_completed`
- Overlay modal con instrucciones

**Pasos del tutorial:**
1. Bienvenida a DevFolio
2. Cómo navegar el dashboard
3. Cómo crear un portfolio
4. Cómo explorar comunidades
5. Cómo enviar mensajes
6. Dónde pedir ayuda

#### `nextStep()`
**¿Qué hace?**
- Avanza al siguiente paso
- Oculta paso actual
- Muestra siguiente
- Highlight del elemento correspondiente

#### `previousStep()`
**¿Qué hace?**
- Retrocede un paso
- Para revisar instrucciones

#### `skipTutorial()`
**¿Qué hace?**
- Salta el tutorial
- Marca como completado
- Guarda flag en localStorage
- No se mostrará de nuevo

#### `completeTutorial()`
**¿Qué hace?**
- Finaliza tutorial
- Guarda `tutorial_completed = true`
- Cierra overlay
- Usuario puede usar la app

---

## utils.js

**Ubicación:** `js/utils.js`  
**Propósito:** Funciones de utilidad generales

### Funciones Principales

#### `formatDate(dateString)`
**¿Qué hace?**
- Formatea fechas de forma legible
- Calcula tiempo relativo:
  - "Hace 2 horas"
  - "Hace 3 días"
  - "Hace 1 semana"
  - O fecha completa si es antiguo

**Algoritmo:**
```javascript
const diff = now - date;
const hours = Math.floor(diff / 3600000);
const days = Math.floor(diff / 86400000);

if (hours < 1) return 'Hace menos de 1 hora';
if (hours < 24) return `Hace ${hours}h`;
if (days < 7) return `Hace ${days}d`;
return date.toLocaleDateString('es-ES');
```

#### `validateEmail(email)`
**¿Qué hace?**
- Valida formato de email
- Usa regex pattern
- Retorna true/false

**Regex:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
```

#### `truncateText(text, maxLength)`
**¿Qué hace?**
- Trunca texto largo
- Añade "..." al final
- Útil para previews

**Ejemplo:**
```javascript
truncateText("Este es un texto muy largo...", 20)
// Retorna: "Este es un texto m..."
```

#### `generateId()`
**¿Qué hace?**
- Genera ID único usando timestamp
- Retorna número entero
- Prácticamente único

```javascript
return Date.now();
```

#### `sanitizeHTML(html)`
**¿Qué hace?**
- Limpia HTML peligroso
- Previene XSS attacks
- Escapa caracteres especiales

---

## toast.js

**Ubicación:** `js/toast.js`  
**Propósito:** Sistema de notificaciones toast

### Funciones Principales

#### `showToast(message, type)`
**¿Qué hace?**
- Muestra notificación temporal
- Tipos: 'success', 'error', 'info', 'warning'
- Auto-desaparece después de 3 segundos
- Animación de entrada/salida

**Parámetros:**
- `message` - Texto a mostrar
- `type` - Tipo de toast (cambia color)

**Proceso:**
```javascript
1. Eliminar toast anterior si existe
2. Crear elemento toast
3. Aplicar clase según tipo
4. Añadir al body
5. Trigger animación de entrada
6. Esperar 3 segundos
7. Animación de salida
8. Eliminar del DOM
```

**CSS classes:**
```javascript
.toast-success // Verde
.toast-error   // Rojo
.toast-info    // Azul
.toast-warning // Amarillo
```

**Uso:**
```javascript
showToast('Portfolio publicado correctamente', 'success');
showToast('Error al guardar', 'error');
showToast('Procesando...', 'info');
```

---

## Archivos Adicionales

### api.js

**Propósito:** Wrapper para llamadas a APIs

**Funciones:**
- `callAdzunaAPI()` - Wrapper para Adzuna
- `handleAPIError()` - Manejo centralizado de errores
- `retry()` - Reintentar llamadas fallidas

### create_job.js

**Propósito:** Crear ofertas de trabajo (feature deshabilitada)

**Nota:** Esta funcionalidad está deshabilitada ya que usamos Adzuna API para trabajos reales.

### admin_users.js

**Propósito:** Gestión detallada de usuarios (legacy)

**Nota:** Funcionalidad integrada en `admin_panel.js`

### cv.js

**Propósito:** Vista de CV (legacy)

**Nota:** Reemplazado por `portfolio_builder.js`

### resources.js

**Propósito:** Página de recursos y documentación

**Funciones:**
- `loadResources()` - Carga recursos disponibles
- Links a documentación
- Tutoriales
- FAQs

---

## 🎯 Resumen de Flujos Importantes

### Flujo de Login

```
1. Usuario entra email/password en form
2. auth.js → loginUser()
3. Busca en localStorage 'all_users'
4. Valida password
5. Guarda sesión en 'user'
6. Actualiza 'lastActive'
7. Redirige según rol
```

### Flujo de Publicar Portfolio

```
1. Usuario completa portfolio en editor
2. Click "Publicar"
3. portfolio_builder.js → publishPortfolio()
4. Valida contenido mínimo
5. Crea objeto con todos los datos
6. Guarda en 'published_portfolios'
7. Redirige a Communities
8. Portfolio aparece en "Recientes"
```

### Flujo de Buscar Trabajo

```
1. Usuario ingresa filtros (keyword, location)
2. Click "Buscar"
3. communities.js → searchJobs()
4. Muestra loading
5. communities.js → fetchAdzunaJobs()
6. Petición HTTP a Adzuna API
7. Recibe JSON con trabajos
8. communities.js → renderJobs()
9. Muestra tarjetas
10. Click en job → Abre en Adzuna
```

### Flujo de Ticket de Soporte

```
USUARIO:
1. Crea ticket en customer_support.js
2. Guarda en 'support_tickets'

ADMIN:
3. Ve ticket en admin_panel.js
4. Responde y marca hasNewResponse = true
5. Guarda en 'support_tickets'

USUARIO:
6. Ve badge "Nueva respuesta"
7. Abre ticket
8. hasNewResponse = false (marca leído)
9. Ve todas las respuestas
```

### Flujo de Mensajería

```
1. User A: Click "Nueva Conversación"
2. messages.js → newConversation()
3. Busca User B
4. Crea conversación en 'conversations'
5. Envía primer mensaje
6. User B: Ve conversación en su lista
7. Abre conversación
8. Mensajes marcados como leídos
9. Responde
10. User A ve badge de no leído
11. Ciclo continúa
```

---

## 📊 Resumen por Tamaño/Complejidad

| Archivo | Líneas | Complejidad | Importancia |
|---------|--------|-------------|-------------|
| `communities.js` | ~800 | ⭐⭐⭐⭐⭐ | Alta - API Adzuna |
| `admin_panel.js` | ~650 | ⭐⭐⭐⭐⭐ | Alta - Gestión total |
| `group_view.js` | ~600 | ⭐⭐⭐⭐ | Media-Alta |
| `portfolio_builder.js` | ~550 | ⭐⭐⭐⭐⭐ | Alta - Core feature |
| `profile.js` | ~500 | ⭐⭐⭐ | Media |
| `skills.js` | ~400 | ⭐⭐⭐ | Media |
| `experience.js` | ~350 | ⭐⭐⭐ | Media |
| `customer_support.js` | ~300 | ⭐⭐⭐ | Media |
| `tutorial.js` | ~250 | ⭐⭐ | Media |
| `auth.js` | ~150 | ⭐⭐⭐⭐ | Alta - Seguridad |
| `utils.js` | ~100 | ⭐⭐ | Baja |
| `toast.js` | ~50 | ⭐ | Baja |

---

## 🔥 Top 5 Funciones Más Importantes

1. **`fetchAdzunaJobs()`** - Integración con API externa
2. **`loginUser()`** - Autenticación y seguridad
3. **`publishPortfolio()`** - Feature principal
4. **`loadReports()`** - Estadísticas en tiempo real
5. **`respondTicket()`** - Sincronización Admin-Usuario

---

**Última actualización:** Diciembre 2025  
**Total de archivos JS:** 20  
**Total de funciones documentadas:** 100+
