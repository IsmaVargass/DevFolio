# DevFolio - Portfolio de Proyectos

DevFolio es una aplicación web SPA (Single Page Application) que permite a los estudiantes crear y gestionar su portfolio de proyectos personales.

## Integrantes
- Ismael Vargas (Frontend & Backend)

## Instalación y Puesta en Marcha

### Requisitos
- Servidor Web (Apache/Nginx) con PHP 7.4+
- MySQL / MariaDB
- XAMPP, WAMP, o similar

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
   - **IMPORTANTE**: Asegúrate de que la tabla `users` tiene la columna `role` (ENUM('admin', 'tecnico', 'user')).
3. **Configuración**:
   - Edita el archivo `api/config/db.php` y ajusta las credenciales de conexión (`$username`, `$password`, `$db_name`) si son diferentes a las por defecto.
4. **Ejecución**:
   - **IMPORTANTE**: Debes acceder a la aplicación a través de `http://localhost/DevFolio/` (o el nombre de tu carpeta).
   - **NO** abras los archivos HTML directamente desde el explorador de archivos (file://), ya que PHP no funcionará.
   - Asegúrate de que Apache y MySQL estén corriendo en XAMPP/WAMP.

### Solución de Problemas

#### Error al registrarse/iniciar sesión
1. **Verifica que estás usando http://localhost**: No abras los archivos con `file://`. Debe ser `http://localhost/DevFolio/html/login.html`.
2. **Verifica que Apache y MySQL están corriendo**: Abre el panel de XAMPP/WAMP y asegúrate de que ambos servicios estén activos.
3. **Verifica la base de datos**: 
   - Abre phpMyAdmin (`http://localhost/phpmyadmin`)
   - Verifica que la base de datos `devfolio` existe
   - Verifica que la tabla `users` tiene la columna `role`
4. **Revisa la consola del navegador**: Presiona F12 y ve a la pestaña "Console" para ver errores detallados.
5. **Verifica las credenciales en `api/config/db.php`**: Usuario por defecto es `root` sin contraseña.

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

## Roles de Usuario

El sistema soporta 3 roles:
- **user**: Usuario estándar (por defecto al registrarse)
- **tecnico**: Acceso al panel de soporte
- **admin**: Acceso completo al panel de administración

Para cambiar el rol de un usuario, edita directamente en la base de datos:
```sql
UPDATE users SET role = 'admin' WHERE email = 'tu@email.com';
```

## Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3 (Variables, Flexbox, Grid), Javascript (ES6+, Fetch API).
- **Backend:** PHP (PDO, Sesiones).
- **Base de Datos:** MySQL.

## Licencia
Este proyecto se distribuye bajo la licencia MIT.