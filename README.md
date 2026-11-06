# 🛡️ MISINCOL Backend API | Documentación de Arquitectura y Servicios

API REST empresarial desarrollada en **NestJS** para la plataforma **MISINCOL (Plan de Desarrollo Ministerial)**. Sigue una arquitectura modular orientada al negocio (**Vertical Slicing**), tipado estricto con TypeScript, validación de contratos vía DTOs (`class-validator`), control de concurrencia optimista y cumplimiento estricto del límite de **150 líneas por archivo**.

---

## 🏛️ 1. Módulos y Estructura del Sistema

```text
backend/src/
├── activities/                         # Gestión de actividades territoriales del PDM
│   ├── dto/                            # CreateActivityDto, UpdateActivityDto (presupuesto, metas, contingencias)
│   ├── entities/                       # Activity Entity
│   ├── activities.controller.ts        # Endpoints REST: GET, POST, PUT, DELETE (< 60 líneas)
│   └── activities.service.ts           # Lógica de negocio y cálculo presupuestal
├── auth/                               # Autenticación JWT y control de acceso
│   ├── auth.controller.ts              # Endpoints de login de administradores y equipos
│   └── auth.service.ts                 # Emisión y verificación de tokens JWT
├── common/                             # Utilidades compartidas y validadores
│   ├── guards/                         # JwtAuthGuard, RolesGuard
│   ├── interceptors/                   # TransformInterceptor, LoggingInterceptor
│   └── validators/                     # IsStageConsistentWithArea (validador de etapas por pilar)
├── objectives/                         # Objetivos estratégicos (Límite estricto de 4)
│   ├── dto/                            # CreateObjectiveDto, UpdateObjectiveDto
│   ├── entities/                       # Objective Entity (dynamicPosition 1..4)
│   ├── objectives.controller.ts        # Endpoints REST protegidos
│   └── objectives.service.ts           # Regla ministerial: máx. 4 objetivos y renumeración
├── reports/                            # Informes ejecutivos y consolidado nacional
├── security/                           # Gestor de roles y matriz de permisos
│   ├── dto/                            # UpdateSecurityMatrixDto
│   ├── entities/                       # SecurityMatrix, SystemRole, SystemPermission
│   ├── security.controller.ts          # Endpoints REST protegidos (GET, PUT /security/matrix)
│   ├── security.service.ts             # Lógica de matriz de permisos por defecto y validación
│   └── security.module.ts              # Módulo exportable de seguridad
├── teams/                              # Supervisión de los 6 equipos misioneros territoriales
├── users/                              # Usuarios, roles y control de acceso
│   ├── dto/                            # CreateUserDto, UpdateUserRoleDto
│   ├── entities/                       # User Entity
│   ├── users.controller.ts             # Endpoints REST (GET, POST, PATCH /users/:id/role)
│   ├── users.service.ts                # Gestión de identidades, hash y reasignación de roles
│   └── users.module.ts                 # Módulo de usuarios
├── workflow/                           # Gobernanza: solicitudes de cambio y bloqueo de planes
├── app.module.ts                       # Módulo raíz de la aplicación (< 40 líneas)
└── main.ts                             # Bootstrap de NestJS con ValidationPipe global
```

---

## 🧭 2. Reglas de Negocio Clave

### 2.1. Límite Estricto de 4 Objetivos por Fase
En `ObjectivesService.create()`:
```typescript
const existing = this.findByTeamAndPillar(dto.teamId, dto.pillarId);
if (existing.length >= 4) {
  throw new BadRequestException('Regla Ministerial: Toda fase admite como máximo 4 objetivos estratégicos.');
}
```
- Cada fase admite entre **1 y 4 objetivos estratégicos**.
- Si se intenta registrar un 5to objetivo, la API responde con código HTTP `400 Bad Request`.
- Al eliminar un objetivo (`delete()`), las posiciones restantes se reordenan automáticamente (1..3).

### 2.2. Validación de Coherencia de Etapas según el Pilar Oficial
- El validador `@IsStageConsistentWithArea()` en `CreateObjectiveDto` e `CreateActivityDto` garantiza que la etapa pertenezca estrictamente al pilar seleccionado:
  - **Investigación**: Contacto primeros oyentes, Inmersión cultural, etc.
  - **Encarnación**: Inmersión Comunitaria, Servicio Práctico, Vínculos Afectivos.
  - **Evangelización**: Proclamación, Grupos de discipulado, etc.
  - **Entrenamiento**: Capacitación de líderes, Talleres bíblicos.
  - **Autocuidado**: Salud física y emocional, Retiros espirituales.

### 2.3. Control de Acceso Basado en Roles (RBAC) y Matriz de Permisos
- **Roles del Sistema (`UserRole`)**:
  - `ROLE_NACIONAL` / `admin` (Director Nacional): Control total sobre misiones, gobernanza, matriz de roles, auditoría sensible e historiales de ingreso.
  - `ROLE_LIDER` / `team` (Líder de Equipo): Gestión operativa de su PDM asignado, notas de campo, solicitud de cambios y asignación de tareas.
  - `ROLE_USUARIO` (Usuario de Equipo): Miembro de campo con acceso a consulta y ejecución de tareas de su misión.
- **Endpoints de Seguridad (`SecurityController` & `UsersController`)**:
  - `GET /security/matrix`: Consulta la matriz activa cruzando roles y permisos del sistema.
  - `PUT /security/matrix`: Actualización protegida de la matriz de permisos (requiere `@Roles(UserRole.ROLE_NACIONAL)`).
  - `GET /security/roles`: Listado de roles reconocidos con sus metadatos y descripciones.
  - `PATCH /users/:id/role`: Asignación y cambio de rol a colaboradores del sistema (requiere `@Roles(UserRole.ROLE_NACIONAL)`).

---

## 💻 3. Comandos de Ejecución

```bash
# Instalación de dependencias
npm install

# Servidor de desarrollo con recarga en caliente
npm run start:dev

# Compilación de producción
npm run build

# Ejecución en modo producción
npm run start:prod
```
