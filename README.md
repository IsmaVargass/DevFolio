# DevFolio - Portfolio de Proyectos

DevFolio es una aplicación web SPA (Single Page Application) que permite a los estudiantes crear y gestionar su portfolio de proyectos personales.

## Integrantes
- Ismael Vargas (Frontend & Backend)

## Instalación y Puesta en Marcha

### Requisitos
- Servidor Web (Apache/Nginx) con PHP 7.4+
- MySQL / MariaDB

### Pasos
1. **Clonar el repositorio** en tu carpeta del servidor web (ej. `htdocs` o `www`).
2. **Base de Datos**:
   - Crea una base de datos llamada `devfolio` (o usa el nombre que prefieras).
   - **Importante**: Dado que no se puede ejecutar `mysql` directamente en este entorno, debes importar el script manualmente.
   - Abre tu herramienta de gestión de base de datos favorita (phpMyAdmin, MySQL Workbench, DBeaver, etc.).
   - Selecciona la base de datos `devfolio`.
   - Busca la opción "Importar" o "Ejecutar Script SQL".
   - Selecciona el archivo `db/database.sql` ubicado en la carpeta del proyecto y ejecútalo.
   - Verifica que las tablas (`users`, `projects`, `skills`, etc.) se hayan creado correctamente.
3. **Configuración**:
   - Edita el archivo `api/config/db.php` y ajusta las credenciales de conexión (`$username`, `$password`, `$db_name`) si son diferentes a las por defecto.
4. **Ejecución**:
   - Abre tu navegador y accede a `http://localhost/DevFolio`.

## Documentación de la API

La API REST devuelve respuestas en formato JSON.

### Autenticación

| Método | Endpoint | Descripción | Body Requerido |
|---|---|---|---|
| POST | `/api/auth/register.php` | Registrar nuevo usuario | `{ "nombre": "...", "email": "...", "password": "..." }` |
| POST | `/api/auth/login.php` | Iniciar sesión | `{ "email": "...", "password": "..." }` |
| GET | `/api/auth/logout.php` | Cerrar sesión | - |
| GET | `/api/auth/session.php` | Verificar estado de sesión | - |

### Proyectos

| Método | Endpoint | Descripción | Body Requerido |
|---|---|---|---|
| GET | `/api/projects/list.php` | Listar proyectos del usuario | - |
| POST | `/api/projects/create.php` | Crear proyecto | `{ "titulo": "...", "descripcion": "...", ... }` |
| PUT | `/api/projects/update.php` | Actualizar proyecto | `{ "id": 1, "titulo": "...", ... }` |
| DELETE | `/api/projects/delete.php` | Eliminar proyecto | `{ "id": 1 }` |

### Expansión (Nuevos Endpoints)

| Recurso | Endpoints (CRUD) | Descripción |
|---|---|---|
| **Skills** | `/api/skills/list.php`, `/create.php`, `/delete.php` | Gestión de habilidades y niveles. |
| **Experience** | `/api/experience/list.php`, `/create.php`, `/delete.php` | Gestión de experiencia laboral. |
| **Education** | `/api/education/list.php`, `/create.php`, `/delete.php` | Gestión de formación académica. |
| **Testimonials** | `/api/testimonials/list.php`, `/create.php`, `/delete.php` | Gestión de testimonios recibidos. |
| **Social** | `/api/social_links/list.php`, `/create.php`, `/delete.php` | Gestión de enlaces a redes sociales. |
| **Messages** | `/api/messages/create.php` (POST), `/list.php` (GET) | Envío y lectura de mensajes de contacto. |

## Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Variables, Flexbox, Grid), Javascript (ES6+, Fetch API).
- **Backend:** PHP (PDO, Sesiones).
- **Base de Datos:** MySQL.

## Licencia
Este proyecto se distribuye bajo la licencia MIT.